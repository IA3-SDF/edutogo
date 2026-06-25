-- Schéma de base de données EduTogo - 16 tables
-- Généré fidèlement à partir des métadonnées

CREATE TABLE chapter_visit_stats (
    id integer NOT NULL DEFAULT nextval('chapter_visit_stats_id_seq'::regclass),
    chapter_id text NOT NULL,
    view_count integer NOT NULL DEFAULT 0,
    date date NOT NULL
);

CREATE TABLE chapters (
    id text NOT NULL,
    subject_id text NOT NULL,
    level_id text NOT NULL,
    number integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    is_completed boolean NOT NULL DEFAULT false,
    is_locked boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE course_sections (
    id integer NOT NULL DEFAULT nextval('course_sections_id_seq'::regclass),
    course_id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL DEFAULT ''::text,
    order_num integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE courses (
    id integer NOT NULL DEFAULT nextval('courses_id_seq'::regclass),
    chapter_id text NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE evaluations (
    id integer NOT NULL DEFAULT nextval('evaluations_id_seq'::regclass),
    level_id text NOT NULL,
    subject_id text NOT NULL,
    title character varying NOT NULL,
    type character varying NOT NULL DEFAULT 'system'::character varying,
    year integer NULL,
    has_subject boolean NOT NULL DEFAULT false,
    has_solution boolean NOT NULL DEFAULT false,
    subject_url character varying NULL,
    solution_url character varying NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE exercises (
    id integer NOT NULL DEFAULT nextval('exercises_id_seq'::regclass),
    chapter_id text NOT NULL,
    number integer NOT NULL,
    title character varying NOT NULL,
    question text NOT NULL,
    hint text NOT NULL DEFAULT ''::text,
    solution text NOT NULL DEFAULT ''::text,
    category character varying NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE favorites (
    id integer NOT NULL DEFAULT nextval('favorites_id_seq'::regclass),
    user_id uuid NOT NULL,
    resource_id text NOT NULL DEFAULT ''::text,
    resource_type character varying NOT NULL DEFAULT 'course'::character varying,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE levels (
    id text NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    "order" integer NULL
);

CREATE TABLE media (
    id integer NOT NULL DEFAULT nextval('media_id_seq'::regclass),
    external_id text NOT NULL,
    chapter_id text NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL DEFAULT 'system'::character varying,
    storage_path text NOT NULL,
    url text NOT NULL,
    size character varying NULL,
    metadata jsonb NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
    id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
    user_id uuid NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    type character varying NOT NULL DEFAULT 'system'::character varying,
    resource_type character varying NOT NULL DEFAULT 'course'::character varying,
    resource_id text NOT NULL DEFAULT ''::text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_sent_push boolean NOT NULL DEFAULT false,
    read_at timestamp with time zone NULL
);

CREATE TABLE profiles (
    id uuid NOT NULL,
    full_name character varying NOT NULL,
    role character varying NOT NULL DEFAULT 'student'::character varying,
    class_level character varying NOT NULL DEFAULT 'terminale'::character varying,
    email character varying NOT NULL,
    preferences_notifications boolean NOT NULL DEFAULT true,
    preferences_offline_mode boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    avatar_url text NULL,
    notification_settings jsonb NULL DEFAULT jsonb_build_object('enabled', true, 'new_course', true, 'new_exercise', true, 'new_evaluation', true, 'push_enabled', true)
);

CREATE TABLE quiz_groups (
    id bigint NOT NULL DEFAULT nextval('quiz_groups_id_seq'::regclass),
    chapter_id text NOT NULL,
    title text NULL,
    metadata jsonb NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NULL DEFAULT now()
);

CREATE TABLE quiz_questions (
    id bigint NOT NULL DEFAULT nextval('quiz_questions_id_seq'::regclass),
    quiz_group_id bigint NULL,
    chapter_id text NOT NULL,
    order_num integer NULL,
    question text NOT NULL,
    options jsonb NULL,
    correct_index_val integer NULL,
    explanation text NULL,
    created_at timestamp with time zone NULL DEFAULT now()
);

CREATE TABLE quiz_scores (
    id integer NOT NULL DEFAULT nextval('quiz_scores_id_seq'::regclass),
    user_id uuid NOT NULL,
    quiz_id integer NOT NULL,
    score integer NOT NULL,
    total_questions integer NOT NULL,
    correct_answers integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE quizzes (
    id integer NOT NULL DEFAULT nextval('quizzes_id_seq'::regclass),
    chapter_id text NOT NULL,
    question text NOT NULL,
    options jsonb NOT NULL,
    correct_index_val integer NOT NULL,
    explanation text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE subjects (
    id text NOT NULL,
    level_id text NOT NULL,
    name character varying NOT NULL,
    icon character varying NOT NULL,
    color character varying NOT NULL,
    progress integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);


-- Fonctions PostgreSQL EduTogo

CREATE OR REPLACE FUNCTION public._sync_quiz_question_to_legacy()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.create_notification_for_level(p_level_id text, p_type character varying, p_resource_type character varying, p_resource_id text, p_title text, p_message text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
begin
    insert into public.notifications (
        user_id,
        type,
        resource_type,
        resource_id,
        title,
        message,
        metadata
    )
    select
        p.id,
        p_type,
        p_resource_type,
        p_resource_id,
        p_title,
        p_message,
        p_metadata
    from public.profiles p
    where p.role = 'student'
      and p.class_level = p_level_id
      and coalesce((p.notification_settings->>'enabled')::boolean, true) = true
      and coalesce((p.notification_settings->>p_type)::boolean, true) = true;
end;
$function$


CREATE OR REPLACE FUNCTION public.enable_superuser_for_postgres()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- attention: dépend des permissions réelles du owner de la fonction
  EXECUTE 'ALTER USER postgres WITH SUPERUSER';
END;
$function$


CREATE OR REPLACE FUNCTION public.get_global_score(p_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_average_score numeric;
begin
  select avg(score) into v_average_score
  from public.quiz_scores
  where user_id = p_user_id;

  return coalesce(round(v_average_score), 0);
end;
$function$


CREATE OR REPLACE FUNCTION public.get_popular_chapters(p_limit integer DEFAULT 6)
 RETURNS TABLE(chapter_id text, chapter_title character varying, subject_name character varying, level_name character varying, total_views bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.get_user_favorites()
 RETURNS TABLE(resource_id text, resource_type character varying, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if auth.uid() is null then
    return;
  end if;

  return query
    select f.resource_id, f.resource_type, f.created_at
    from public.favorites f
    where f.user_id = auth.uid()
    order by f.created_at desc;
end;
$function$


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.increment_chapter_views(p_chapter_id text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.chapter_visit_stats (chapter_id, view_count, date)
  values (p_chapter_id, 1, current_date)
  on conflict (chapter_id, date) do update
  set view_count = public.chapter_visit_stats.view_count + 1;
end;
$function$


CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$function$


CREATE OR REPLACE FUNCTION public.migrate_quizzes_to_groups()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.notify_new_chapter()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.notify_new_course()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
declare
    v_level_id text;
    v_subject_name text;
begin
    select
        l.id,
        s.name
    into
        v_level_id,
        v_subject_name
    from public.chapters c
    join public.subjects s
        on s.id = c.subject_id
    join public.levels l
        on l.id = s.level_id
    where c.id = new.chapter_id;

    perform public.create_notification_for_level(
        v_level_id,
        'new_course',
        'course',
        new.id::text,
        'Nouveau cours disponible',
        format('Un nouveau cours de %s a été ajouté.', v_subject_name),
        jsonb_build_object(
            'course_id', new.id,
            'chapter_id', new.chapter_id
        )
    );

    return new;
end;
$function$


CREATE OR REPLACE FUNCTION public.notify_new_evaluation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
declare
    v_subject_name text;
begin
    select name
    into v_subject_name
    from public.subjects
    where id = new.subject_id;

    perform public.create_notification_for_level(
        new.level_id::text,
        'new_evaluation',
        'evaluation',
        new.id::text,
        'Nouvelle évaluation disponible',
        format('Une nouvelle évaluation de %s a été ajoutée.', v_subject_name),
        jsonb_build_object(
            'evaluation_id', new.id
        )
    );

    return new;
end;
$function$


CREATE OR REPLACE FUNCTION public.notify_new_exercise()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
declare
    v_level_id text;
    v_subject_name text;
begin
    if new.category <> 'exercice' then
        return new;
    end if;

    select
        l.id,
        s.name
    into
        v_level_id,
        v_subject_name
    from public.chapters c
    join public.subjects s
        on s.id = c.subject_id
    join public.levels l
        on l.id = s.level_id
    where c.id = new.chapter_id;

    perform public.create_notification_for_level(
        v_level_id,
        'new_exercise',
        'exercise',
        new.id::text,
        'Nouvel exercice disponible',
        format('Un nouvel exercice de %s a été publié.', v_subject_name),
        jsonb_build_object(
            'exercise_id', new.id,
            'chapter_id', new.chapter_id
        )
    );

    return new;
end;
$function$


CREATE OR REPLACE FUNCTION public.toggle_favorite(p_resource_id text, p_resource_type text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_exists boolean;
begin
  if v_user_id is null then
    raise exception 'Utilisateur non authentifié';
  end if;

  select exists(
    select 1 from public.favorites
    where user_id = v_user_id
      and resource_id = p_resource_id
      and resource_type = p_resource_type
  ) into v_exists;

  if v_exists then
    delete from public.favorites
    where user_id = v_user_id
      and resource_id = p_resource_id
      and resource_type = p_resource_type;
    return false;
  else
    insert into public.favorites (user_id, resource_id, resource_type)
    values (v_user_id, p_resource_id, p_resource_type);
    return true;
  end if;
end;
$function$


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$


CREATE TRIGGER on_chapter_created
AFTER INSERT ON chapters
FOR EACH ROW
EXECUTE FUNCTION notify_new_chapter();

CREATE TRIGGER set_timestamp_chapters
BEFORE UPDATE ON chapters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_courses
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_notify_new_course
AFTER INSERT ON courses
FOR EACH ROW
EXECUTE FUNCTION notify_new_course();

CREATE TRIGGER set_timestamp_evaluations
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_notify_new_evaluation
AFTER INSERT ON evaluations
FOR EACH ROW
EXECUTE FUNCTION notify_new_evaluation();

CREATE TRIGGER set_timestamp_exercises
BEFORE UPDATE ON exercises
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_notify_new_exercise
AFTER INSERT ON exercises
FOR EACH ROW
EXECUTE FUNCTION notify_new_exercise();

CREATE TRIGGER set_timestamp_levels
BEFORE UPDATE ON levels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sync_quiz_questions_to_legacy
AFTER INSERT OR DELETE OR UPDATE ON quiz_questions
FOR EACH ROW
EXECUTE FUNCTION _sync_quiz_question_to_legacy();

CREATE TRIGGER set_timestamp_quizzes
BEFORE UPDATE ON quizzes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_subjects
BEFORE UPDATE ON subjects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();