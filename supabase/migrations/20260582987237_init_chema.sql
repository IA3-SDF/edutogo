create table public.notifications (
    id uuid primary key default gen_random_uuid(),

    -- Destinataire
    user_id uuid references public.profiles(id) on delete cascade not null,

    -- Type de notification
    type varchar(50) not null check (
        type in (
            'new_course',
            'new_exercise',
            'new_evaluation',
            'system'
        )
    ),

    -- Ressource concernée
    resource_type varchar(50) not null check (
        resource_type in (
            'course',
            'exercise',
            'evaluation'
        )
    ),

    resource_id text not null,

    -- Contenu affiché
    title varchar(255) not null,
    message text not null,

    -- Métadonnées personnalisables
    metadata jsonb default '{}'::jsonb not null,

    -- États
    is_read boolean default false not null,
    is_sent_push boolean default false not null,

    created_at timestamptz default now() not null,
    read_at timestamptz
);


create index idx_notifications_user
on public.notifications(user_id);

create index idx_notifications_user_read
on public.notifications(user_id, is_read);

create index idx_notifications_created_at
on public.notifications(created_at desc);

create index idx_notifications_resource
on public.notifications(resource_type, resource_id);



alter table public.profiles
add column notification_settings jsonb
default jsonb_build_object(
    'enabled', true,
    'new_course', true,
    'new_exercise', true,
    'new_evaluation', true,
    'push_enabled', true
);

create or replace function public.create_notification_for_level(
    p_level_id text,
    p_type varchar,
    p_resource_type varchar,
    p_resource_id text,
    p_title text,
    p_message text,
    p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
as $$
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

      -- Notifications globalement activées
      and coalesce(
            (p.notification_settings->>'enabled')::boolean,
            true
      ) = true

      -- Notification spécifique activée
      and coalesce(
            (p.notification_settings->>p_type)::boolean,
            true
      ) = true;

end;
$$;


create or replace function public.notify_new_course()
returns trigger
language plpgsql
security definer
as $$
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
        format(
            'Un nouveau cours de %s a été ajouté.',
            v_subject_name
        ),
        jsonb_build_object(
            'course_id', new.id,
            'chapter_id', new.chapter_id
        )
    );

    return new;
end;
$$;

create trigger trg_notify_new_course
after insert on public.courses
for each row
execute function public.notify_new_course();


create or replace function public.notify_new_exercise()
returns trigger
language plpgsql
security definer
as $$
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
        format(
            'Un nouvel exercice de %s a été publié.',
            v_subject_name
        ),
        jsonb_build_object(
            'exercise_id', new.id,
            'chapter_id', new.chapter_id
        )
    );

    return new;
end;
$$;

create trigger trg_notify_new_exercise
after insert on public.exercises
for each row
execute function public.notify_new_exercise();



create or replace function public.notify_new_evaluation()
returns trigger
language plpgsql
security definer
as $$
declare
    v_subject_name text;
begin

    select name
    into v_subject_name
    from public.subjects
    where id = new.subject_id;

    perform public.create_notification_for_level(
        new.level_id,
        'new_evaluation',
        'evaluation',
        new.id::text,
        'Nouvelle évaluation disponible',
        format(
            'Une nouvelle évaluation de %s a été ajoutée.',
            v_subject_name
        ),
        jsonb_build_object(
            'evaluation_id', new.id
        )
    );

    return new;
end;
$$;

create trigger trg_notify_new_evaluation
after insert on public.evaluations
for each row
execute function public.notify_new_evaluation();



