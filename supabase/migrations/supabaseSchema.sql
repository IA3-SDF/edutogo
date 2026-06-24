-- ============================================================
-- EduTogo — Script SQL final (nouveau projet Supabase, propre)
-- PostgreSQL 15+
--
-- Changements vs version précédente :
--   - levels.id / subjects.id / chapters.id : serial → text
--     (le frontend génère déjà ses propres slugs stables ;
--      Supabase ne doit plus en générer d'autres à sa place)
--   - Toutes les FK qui pointaient vers ces colonnes : integer → text
--   - favorites.resource_id : integer → text (polymorphe : peut
--     référencer un chapitre (text) ou une évaluation (integer))
--   - Ajout : unique(level_id, name) sur subjects
--             unique(subject_id, title) sur chapters
--   - Section seed (niveaux/matières/chapitres de démo) retirée :
--     tout se crée maintenant depuis l'AdminDashboard
-- ============================================================

-- 0. CLEANUP
-- Add media metadata table for chapter assets
-- Only the new objects are kept here so the migration applies cleanly on top of existing schema.

create table if not exists public.media (
  id serial primary key,
  external_id text not null,
  chapter_id text references public.chapters(id) on delete cascade not null,
  name varchar(255) not null,
  type varchar(20) not null check (type in ('image','audio','video')),
  storage_path text not null,
  url text not null,
  size varchar(50),
  metadata jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint uniq_media_external_id unique(external_id)
);

create index if not exists idx_media_chapter_id on public.media(chapter_id);

grant select on public.media to anon, authenticated;
grant insert, update, delete on public.media to authenticated;

drop table if exists public.notifications cascade;
drop table if exists public.chapter_visit_stats cascade;
drop table if exists public.quiz_scores cascade;
drop table if exists public.favorites cascade;
drop table if exists public.quiz_options cascade;
drop table if exists public.evaluations cascade;
drop table if exists public.quizzes cascade;
drop table if exists public.course_sections cascade;
drop table if exists public.courses cascade;
drop table if exists public.exercises cascade;
drop table if exists public.media cascade;
drop table if exists public.chapters cascade;
drop table if exists public.subjects cascade;
drop table if exists public.levels cascade;
drop table if exists public.profiles cascade;

drop trigger if exists on_auth_user_created on auth.users;

drop policy if exists "Allow admin write on media storage" on storage.objects;
drop policy if exists "Allow admin write on evaluations storage" on storage.objects;

drop function if exists public.get_popular_chapters(integer);
drop function if exists public.get_global_score(uuid);
drop function if exists public.increment_chapter_views(text);
drop function if exists public.increment_chapter_views(integer);
drop function if exists public.notify_new_chapter();
drop function if exists public.handle_new_user();
drop function if exists public.is_admin();

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. HELPER TO STAMP MODIFIED ROWS
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. TABLES

-- Levels — id en TEXT (ex: 'terminale', 'premiere-c'), créé par l'admin
create table public.levels (
  id text primary key,
  name varchar(100) not null,
  description text default '' not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Subjects — id en TEXT (ex: 'mathematiques-terminale')
create table public.subjects (
  id text primary key,
  level_id text references public.levels(id) on delete cascade not null,
  name varchar(100) not null,
  icon varchar(50) default 'BookOpen' not null,
  color varchar(30) default 'blue' not null,
  progress integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint uniq_level_subject_name unique(level_id, name)
);

-- Chapters — id en TEXT (ex: 'chap-1718890123456')
create table public.chapters (
  id text primary key,
  subject_id text references public.subjects(id) on delete cascade not null,
  level_id text references public.levels(id) on delete cascade not null,
  number integer not null,
  title varchar(200) not null,
  description text default '' not null,
  is_completed boolean default false not null,
  is_locked boolean default false not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint uniq_subject_chapter_number unique(subject_id, number),
  constraint uniq_subject_chapter_title unique(subject_id, title)
);

-- Courses — reste en id auto-incrémenté (pas de slug généré côté frontend)
create table public.courses (
  id serial primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  title varchar(200) not null,
  content text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Course Sections
create table public.course_sections (
  id serial primary key,
  course_id integer references public.courses(id) on delete cascade not null,
  title varchar(200) not null,
  content text default '' not null,
  order_num integer not null,
  created_at timestamp with time zone default now() not null,
  constraint uniq_course_section_order unique(course_id, order_num)
);

-- Exercises
create table public.exercises (
  id serial primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  number integer not null,
  title varchar(200) not null,
  question text not null,
  hint text default '' not null,
  solution text default '' not null,
  category varchar(50) not null check (category in ('activité','exercice')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint uniq_chapter_exercise_number unique(chapter_id, number)
);

-- Quizzes
create table public.quizzes (
  id serial primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  question text not null,
  options jsonb default '[]'::jsonb not null,
  correct_index_val integer default 0 not null,
  explanation text default '' not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Evaluations
create table public.evaluations (
  id serial primary key,
  level_id text references public.levels(id) on delete cascade not null,
  subject_id text references public.subjects(id) on delete cascade not null,
  title varchar(200) not null,
  type varchar(20) not null check (type in ('DS','Annale')),
  year integer,
  has_subject boolean default false not null,
  has_solution boolean default false not null,
  subject_url varchar(500),
  solution_url varchar(500),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Profiles (étend auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name varchar(200) not null,
  role varchar(50) default 'student' not null check (role in ('student','admin')),
  class_level varchar(50) default 'terminale' not null,
  email varchar(255) not null unique,
  preferences_notifications boolean default true not null,
  preferences_offline_mode boolean default false not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Favorites — resource_id en TEXT (polymorphe : chapitre [text] ou évaluation [int->text])
create table public.favorites (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  resource_id text not null,
  resource_type varchar(20) not null check (resource_type in ('course','exercise','quiz','evaluation')),
  created_at timestamp with time zone default now() not null,
  constraint uniq_user_favorite_resource unique(user_id, resource_id, resource_type)
);

-- Quiz Scores
create table public.quiz_scores (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id integer references public.quizzes(id) on delete cascade not null,
  score integer not null check (score >= 0 and score <= 100),
  total_questions integer not null,
  correct_answers integer not null,
  created_at timestamp with time zone default now() not null,
  constraint uniq_user_quiz unique(user_id, quiz_id)
);

-- Chapter Visit Stats — table d'agrégation des vues par chapitre et par date
create table public.chapter_visit_stats (
  id serial primary key,
  chapter_id text references public.chapters(id) on delete cascade not null,
  view_count integer default 0 not null,
  date date not null,
  constraint uniq_chapter_date unique(chapter_id, date)
);

-- Notifications
create table public.notifications (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title varchar(200) not null,
  message text not null,
  is_read boolean default false not null,
  created_at timestamp with time zone default now() not null
);


-- 4. FOREIGN KEY INDEXES
create index idx_subjects_level_id on public.subjects(level_id);
create index idx_chapters_subject_id on public.chapters(subject_id);
create index idx_chapters_level_id on public.chapters(level_id);
create index idx_courses_chapter_id on public.courses(chapter_id);
create index idx_course_sections_course_id on public.course_sections(course_id);
create index idx_exercises_chapter_id on public.exercises(chapter_id);
create index idx_quizzes_chapter_id on public.quizzes(chapter_id);
create index idx_evaluations_level_id on public.evaluations(level_id);
create index idx_evaluations_subject_id on public.evaluations(subject_id);
create index idx_favorites_user_id on public.favorites(user_id);
create index idx_quiz_scores_user_id on public.quiz_scores(user_id);
create index idx_chapter_visit_stats_chapter on public.chapter_visit_stats(chapter_id);
create index idx_chapter_visit_stats_date on public.chapter_visit_stats(date);
create index idx_notifications_user_id on public.notifications(user_id);


-- 5. BUSINESS SQL FUNCTIONS

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Incrémente le compteur de vues d'un chapitre pour la date courante
-- À appeler depuis le frontend à chaque visite de chapitre
create or replace function public.increment_chapter_views(p_chapter_id text)
returns void as $$
begin
  insert into public.chapter_visit_stats (chapter_id, view_count, date)
  values (p_chapter_id, 1, current_date)
  on conflict (chapter_id, date) do update
  set view_count = public.chapter_visit_stats.view_count + 1;
end;
$$ language plpgsql security definer;

-- Retourne le score global moyen d'un élève
create or replace function public.get_global_score(p_user_id uuid)
returns integer as $$
declare
  v_average_score numeric;
begin
  select avg(score) into v_average_score
  from public.quiz_scores
  where user_id = p_user_id;

  return coalesce(round(v_average_score), 0);
end;
$$ language plpgsql security definer;

-- Retourne les chapitres les plus visités sur les 30 derniers jours
-- Utilisé par le frontend pour afficher "Chapitres Populaires"
create or replace function public.get_popular_chapters(p_limit integer default 6)
returns table (
  chapter_id text,
  chapter_title varchar,
  subject_name varchar,
  level_name varchar,
  total_views bigint
) as $$
begin
  return query
    select 
      c.id as chapter_id,
      c.title as chapter_title,
      m.name as subject_name,
      n.name as level_name,
      coalesce(sum(v.view_count), 0) as total_views
    from public.chapters c
    join public.subjects m on c.subject_id = m.id
    join public.levels n on c.level_id = n.id
    left join public.chapter_visit_stats v on v.chapter_id = c.id and v.date >= current_date - interval '30 days'
    group by c.id, c.title, m.name, n.name
    order by total_views desc
    limit p_limit;
end;
$$ language plpgsql security definer;


-- 6. TRIGGERS

create or replace trigger set_timestamp_levels
  before update on public.levels
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_subjects
  before update on public.subjects
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_chapters
  before update on public.chapters
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_courses
  before update on public.courses
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_exercises
  before update on public.exercises
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_quizzes
  before update on public.quizzes
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_evaluations
  before update on public.evaluations
  for each row execute procedure public.update_updated_at_column();

create or replace trigger set_timestamp_profiles
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();


-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, class_level, email, preferences_notifications, preferences_offline_mode)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Élève Togolais'),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'class_level', 'terminale'),
    new.email,
    true,
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Notification : nouvelle ressource (chapitre) disponible pour la classe concernée
create or replace function public.notify_new_chapter()
returns trigger as $$
declare
  v_user_record record;
begin
  for v_user_record in
    select p.id
    from public.profiles p
    join public.levels n on n.id = new.level_id
    where p.preferences_notifications = true
      and lower(p.class_level) = lower(n.name)
  loop
    insert into public.notifications (user_id, title, message)
    values (
      v_user_record.id,
      'Nouveau Chapitre Disponible !',
      'Le chapitre « ' || new.title || ' » a été ajouté à votre programme d''études.'
    );
  end loop;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_chapter_created
  after insert on public.chapters
  for each row execute procedure public.notify_new_chapter();


-- 7. ROW LEVEL SECURITY (RLS) & POLICIES
alter table public.levels enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.courses enable row level security;
alter table public.course_sections enable row level security;
alter table public.exercises enable row level security;
alter table public.quizzes enable row level security;
alter table public.evaluations enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.quiz_scores enable row level security;
alter table public.chapter_visit_stats enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Allow public read on levels" on public.levels;
create policy "Allow public read on levels" on public.levels for select using (true);
drop policy if exists "Allow admin write on levels" on public.levels;
create policy "Allow admin write on levels" on public.levels for all using (public.is_admin());

drop policy if exists "Allow public read on subjects" on public.subjects;
create policy "Allow public read on subjects" on public.subjects for select using (true);
drop policy if exists "Allow admin write on subjects" on public.subjects;
create policy "Allow admin write on subjects" on public.subjects for all using (public.is_admin());

drop policy if exists "Allow public read on chapters" on public.chapters;
create policy "Allow public read on chapters" on public.chapters for select using (true);
drop policy if exists "Allow admin write on chapters" on public.chapters;
create policy "Allow admin write on chapters" on public.chapters for all using (public.is_admin());

drop policy if exists "Allow public read on courses" on public.courses;
create policy "Allow public read on courses" on public.courses for select using (true);
drop policy if exists "Allow admin write on courses" on public.courses;
create policy "Allow admin write on courses" on public.courses for all using (public.is_admin());

drop policy if exists "Allow public read on course_sections" on public.course_sections;
create policy "Allow public read on course_sections" on public.course_sections for select using (true);
drop policy if exists "Allow admin write on course_sections" on public.course_sections;
create policy "Allow admin write on course_sections" on public.course_sections for all using (public.is_admin());

drop policy if exists "Allow public read on exercises" on public.exercises;
create policy "Allow public read on exercises" on public.exercises for select using (true);
drop policy if exists "Allow admin write on exercises" on public.exercises;
create policy "Allow admin write on exercises" on public.exercises for all using (public.is_admin());

drop policy if exists "Allow public read on quizzes" on public.quizzes;
create policy "Allow public read on quizzes" on public.quizzes for select using (true);
drop policy if exists "Allow admin write on quizzes" on public.quizzes;
create policy "Allow admin write on quizzes" on public.quizzes for all using (public.is_admin());

drop policy if exists "Allow public read on evaluations" on public.evaluations;
create policy "Allow public read on evaluations" on public.evaluations for select using (true);
drop policy if exists "Allow admin write on evaluations" on public.evaluations;
create policy "Allow admin write on evaluations" on public.evaluations for all using (public.is_admin());

drop policy if exists "Allow admin read on chapter_visit_stats" on public.chapter_visit_stats;
create policy "Allow admin read on chapter_visit_stats" on public.chapter_visit_stats for select using (public.is_admin());
drop policy if exists "Allow admin write on chapter_visit_stats" on public.chapter_visit_stats;
create policy "Allow admin write on chapter_visit_stats" on public.chapter_visit_stats for all using (public.is_admin());

drop policy if exists "Allow self select profile" on public.profiles;
create policy "Allow self select profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "Allow self update profile" on public.profiles;
create policy "Allow self update profile" on public.profiles for update using (auth.uid() = id or public.is_admin());

drop policy if exists "Allow self read favorites" on public.favorites;
create policy "Allow self read favorites" on public.favorites for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "Allow self insert favorite" on public.favorites;
create policy "Allow self insert favorite" on public.favorites for insert with check (auth.uid() = user_id);
drop policy if exists "Allow self delete favorite" on public.favorites;
create policy "Allow self delete favorite" on public.favorites for delete using (auth.uid() = user_id);

drop policy if exists "Allow self read quiz scores" on public.quiz_scores;
create policy "Allow self read quiz scores" on public.quiz_scores for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "Allow self insert quiz score" on public.quiz_scores;
create policy "Allow self insert quiz score" on public.quiz_scores for insert with check (auth.uid() = user_id);

drop policy if exists "Allow self read notifications" on public.notifications;
create policy "Allow self read notifications" on public.notifications for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "Allow self update notifications" on public.notifications;
create policy "Allow self update notifications" on public.notifications for update using (auth.uid() = user_id);


-- 8. STORAGE BUCKETS & STORAGE RLS POLICIES
insert into storage.buckets (id, name, public) 
values 
  ('media', 'media', false),
  ('evaluations', 'evaluations', false),
  ('avatars', 'avatars', false)
on conflict (id) do nothing;

drop policy if exists "Allow select storage files for authenticated" on storage.objects;
create policy "Allow select storage files for authenticated" on storage.objects
  for select using (auth.role() = 'authenticated');

drop policy if exists "Allow admin write on media storage" on storage.objects;
create policy "Allow admin write on media storage" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Allow admin write on evaluations storage" on storage.objects;
create policy "Allow admin write on evaluations storage" on storage.objects
  for all using (bucket_id = 'evaluations' and public.is_admin());

drop policy if exists "Allow student write on avatars storage" on storage.objects;
create policy "Allow student write on avatars storage" on storage.objects
  for all using (bucket_id = 'avatars' and (auth.uid()::text = (storage.foldername(name))[1]))
  with check (bucket_id = 'avatars' and (auth.uid()::text = (storage.foldername(name))[1]));


-- 9. GRANTS
grant usage on schema public to anon, authenticated;

grant select on public.levels to anon, authenticated;
grant select on public.subjects to anon, authenticated;
grant select on public.chapters to anon, authenticated;
grant select on public.courses to anon, authenticated;
grant select on public.course_sections to anon, authenticated;
grant select on public.exercises to anon, authenticated;
grant select on public.quizzes to anon, authenticated;
grant select on public.evaluations to anon, authenticated;
grant select on public.media to anon, authenticated;

grant insert, update, delete on public.levels to authenticated;
grant insert, update, delete on public.subjects to authenticated;
grant insert, update, delete on public.chapters to authenticated;
grant insert, update, delete on public.courses to authenticated;
grant insert, update, delete on public.course_sections to authenticated;
grant insert, update, delete on public.exercises to authenticated;
grant insert, update, delete on public.quizzes to authenticated;
grant insert, update, delete on public.media to authenticated;
grant insert, update, delete on public.evaluations to authenticated;

grant select on public.chapter_visit_stats to authenticated;
grant insert, update on public.chapter_visit_stats to authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert on public.quiz_scores to authenticated;
grant select, update on public.notifications to authenticated;

grant usage, select on all sequences in schema public to authenticated;

-- ============================================================
-- FIN — aucune donnée de seed : niveaux, matières et chapitres
-- se créent désormais exclusivement depuis l'AdminDashboard.
-- ============================================================