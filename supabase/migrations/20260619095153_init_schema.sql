-- Migration: add avatar_url and RLS policies for profiles and storage

-- 1. Ensure the media storage objects table uses RLS
alter table if exists storage.objects enable row level security;

drop policy if exists "Avatar user insert" on storage.objects;
create policy "Avatar user insert" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and name like concat('avatars/', auth.uid(), '/%')
  );

drop policy if exists "Avatar user select" on storage.objects;
create policy "Avatar user select" on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and name like concat('avatars/', auth.uid(), '/%')
  );

drop policy if exists "Avatar user update" on storage.objects;
create policy "Avatar user update" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and name like concat('avatars/', auth.uid(), '/%')
  )
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and name like concat('avatars/', auth.uid(), '/%')
  );

drop policy if exists "Avatar user delete" on storage.objects;
create policy "Avatar user delete" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and name like concat('avatars/', auth.uid(), '/%')
  );

-- 2. Profiles can store avatar URLs and users manage their own row
alter table if exists public.profiles add column if not exists avatar_url varchar(500);

alter table if exists public.profiles enable row level security;

drop policy if exists "Allow authenticated user select own profile" on public.profiles;
create policy "Allow authenticated user select own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Allow authenticated user insert own profile" on public.profiles;
create policy "Allow authenticated user insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Allow authenticated user update own profile" on public.profiles;
create policy "Allow authenticated user update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Allow authenticated user delete own profile" on public.profiles;
create policy "Allow authenticated user delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);
