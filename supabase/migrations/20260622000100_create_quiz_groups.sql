-- Migration: Create quiz_groups and quiz_questions, add RLS, functions and triggers
-- Provides a robust migration path from legacy `quizzes` -> grouped model
-- WARNING: This file contains a final DROP of the legacy `quizzes` table.
-- Run the migration in stages: create tables -> migrate data -> enable dual-write -> verify -> DROP legacy.

-- =============================================================
-- 1) Create tables and indexes
-- =============================================================
create table if not exists public.quiz_groups (
	id bigserial primary key,
	chapter_id text not null,
	title text,
	metadata jsonb default '{}'::jsonb,
	created_at timestamptz default now()
);

create table if not exists public.quiz_questions (
	id bigserial primary key,
	quiz_group_id bigint references public.quiz_groups(id) on delete cascade,
	chapter_id text not null,
	order_num int default 0,
	question text not null,
	options jsonb default '[]'::jsonb,
	correct_index_val int default 0,
	explanation text,
	created_at timestamptz default now()
);

create index if not exists idx_quiz_questions_quiz_group_id on public.quiz_questions (quiz_group_id);
create index if not exists idx_quiz_questions_chapter_id on public.quiz_questions (chapter_id);
create index if not exists idx_quiz_groups_chapter_id on public.quiz_groups (chapter_id);

-- =============================================================
-- 2) RLS: enable and policies
--    - Students (authenticated) can SELECT
--    - Admins (profiles.role = 'admin') can INSERT / UPDATE / DELETE
-- =============================================================
alter table if exists public.quiz_groups enable row level security;
alter table if exists public.quiz_questions enable row level security;

drop policy if exists "Allow authenticated select quiz_groups" on public.quiz_groups;
create policy "Allow authenticated select quiz_groups"
	on public.quiz_groups
	for select
	to authenticated
	using (true);

drop policy if exists "Allow authenticated select quiz_questions" on public.quiz_questions;
create policy "Allow authenticated select quiz_questions"
	on public.quiz_questions
	for select
	to authenticated
	using (true);

-- Allow admin users (profiles.role = 'admin') to insert/update/delete
drop policy if exists "Allow admin write quiz_groups" on public.quiz_groups;
create policy "Allow admin write quiz_groups"
	on public.quiz_groups
	for all
	using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
	with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Allow admin write quiz_questions" on public.quiz_questions;
create policy "Allow admin write quiz_questions"
	on public.quiz_questions
	for all
	using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
	with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =============================================================
-- 3) Legacy compatibility: ensure `quizzes` exists (it may already)
--    We will use it as a backward-compatible view/table until migration completes
-- =============================================================
-- If `quizzes` doesn't exist, create a lightweight compatible table to avoid runtime errors
create table if not exists public.quizzes (
	id bigserial primary key,
	chapter_id text not null,
	question text not null,
	options jsonb default '[]'::jsonb,
	correct_index_val int default 0,
	explanation text,
	created_at timestamptz default now()
);

alter table if exists public.quizzes enable row level security;
drop policy if exists "Allow authenticated select quizzes" on public.quizzes;
create policy "Allow authenticated select quizzes"
	on public.quizzes
	for select
	to authenticated
	using (true);

-- Admin writes on legacy table allowed for admins (same rule)
drop policy if exists "Allow admin write quizzes" on public.quizzes;
create policy "Allow admin write quizzes"
	on public.quizzes
	for all
	using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
	with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =============================================================
-- 4) Migration helper function: migrate legacy `quizzes` -> grouped model
--    - Creates one 'Legacy' group per chapter and moves questions
--    Run this function once when ready.
-- =============================================================
create or replace function public.migrate_quizzes_to_groups() returns void language plpgsql as $$
declare
	r record;
	grp_id bigint;
begin
	for r in select distinct chapter_id from public.quizzes loop
		-- Create a group for this chapter if not exists
		insert into public.quiz_groups (chapter_id, title, metadata)
		select r.chapter_id, concat('Legacy import - ', r.chapter_id), '{}'::jsonb
		where not exists (select 1 from public.quiz_groups g where g.chapter_id = r.chapter_id);
	end loop;

	-- Insert questions mapping to group
	insert into public.quiz_questions (quiz_group_id, chapter_id, order_num, question, options, correct_index_val, explanation, created_at)
	select g.id, q.chapter_id, row_number() over (partition by q.chapter_id order by q.id) - 1, q.question, q.options::jsonb, q.correct_index_val, q.explanation, q.created_at
	from public.quizzes q
	join public.quiz_groups g on g.chapter_id = q.chapter_id
	on conflict do nothing;
end;
$$;

-- =============================================================
-- 5) Dual-write triggers: keep legacy `quizzes` in sync when new model is edited
--    - Forward sync from `quiz_questions` -> `quizzes`
--    Notes: we intentionally avoid a reverse trigger to prevent loops.
-- =============================================================
create or replace function public._sync_quiz_question_to_legacy() returns trigger language plpgsql as $$
begin
	if (TG_OP = 'INSERT') then
		insert into public.quizzes (id, chapter_id, question, options, correct_index_val, explanation, created_at)
		values (NEW.id, NEW.chapter_id, NEW.question, NEW.options::jsonb, NEW.correct_index_val, NEW.explanation, NEW.created_at)
		on conflict (id) do update set chapter_id = EXCLUDED.chapter_id, question = EXCLUDED.question, options = EXCLUDED.options, correct_index_val = EXCLUDED.correct_index_val, explanation = EXCLUDED.explanation, created_at = EXCLUDED.created_at;
		return NEW;
	elsif (TG_OP = 'UPDATE') then
		update public.quizzes set chapter_id = NEW.chapter_id, question = NEW.question, options = NEW.options::jsonb, correct_index_val = NEW.correct_index_val, explanation = NEW.explanation, created_at = NEW.created_at where id = NEW.id;
		return NEW;
	elsif (TG_OP = 'DELETE') then
		delete from public.quizzes where id = OLD.id;
		return OLD;
	end if;
	return null;
end;
$$;

-- Create trigger on quiz_questions
drop trigger if exists trg_sync_quiz_questions_to_legacy on public.quiz_questions;
create trigger trg_sync_quiz_questions_to_legacy
	after insert or update or delete on public.quiz_questions
	for each row execute function public._sync_quiz_question_to_legacy();

-- =============================================================
-- 6) Convenience views & helpers for backward compatibility
--    - A view that exposes grouped questions flattened like legacy `quizzes`
-- =============================================================
create or replace view public.view_quizzes_flattened as
select q.id, q.chapter_id, q.question, q.options, q.correct_index_val, q.explanation, q.created_at
from public.quiz_questions q
order by q.chapter_id, q.order_num, q.id;

-- Optionally, you can point service code to `view_quizzes_flattened` while migrating.

-- =============================================================
-- 7) Final optional cleanup: drop legacy `quizzes` table
--    Keep this commented until you've validated migration.
-- =============================================================
-- WARNING: destructive. Only run after thorough verification and backups.
-- DROP TABLE IF EXISTS public.quizzes CASCADE;

-- End of migration
