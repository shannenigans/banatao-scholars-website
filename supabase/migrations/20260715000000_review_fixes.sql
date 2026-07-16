begin;

create table if not exists public.scholars (
  id bigserial primary key,
  status text,
  year text,
  first text,
  middle text,
  last text,
  school text,
  major text,
  email text,
  "oldEmails" text,
  "cellPhone" text,
  "schoolPhone" text,
  "homePhone" text,
  "schoolAddress" text,
  "schoolAddress2" text,
  "schoolCity" text,
  "schoolState" text,
  "schoolZip" text,
  "homeAddress" text,
  "homeCity" text,
  "homeState" text,
  "homeZip" text,
  parents text,
  "parentsContact" text,
  "currentAddress" text,
  "currentCity" text,
  "currentState" text,
  "currentZip" text,
  "currentPhone" text,
  description text,
  company text,
  "imageUrl" text,
  bio text
);

create table if not exists public.email_whitelist (
  email text primary key,
  "isAdmin" boolean not null default false
);

do $$
declare
  required_column text;
begin
  if to_regclass('public.scholars') is null or to_regclass('public.email_whitelist') is null then
    raise exception 'Expected public.scholars and public.email_whitelist before applying this migration';
  end if;

  foreach required_column in array array[
    'id', 'status', 'year', 'first', 'middle', 'last', 'school', 'major',
    'email', 'oldEmails', 'cellPhone', 'schoolPhone', 'homePhone',
    'schoolAddress', 'schoolAddress2', 'schoolCity', 'schoolState', 'schoolZip',
    'homeAddress', 'homeCity', 'homeState', 'homeZip', 'parents', 'parentsContact',
    'currentAddress', 'currentCity', 'currentState', 'currentZip', 'currentPhone',
    'description', 'company', 'imageUrl', 'bio'
  ] loop
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'scholars' and column_name = required_column
    ) then
      raise exception 'Required scholars column % is missing', required_column;
    end if;
  end loop;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'email_whitelist' and column_name = 'isAdmin'
  ) then
    raise exception 'Required email_whitelist column isAdmin is missing';
  end if;

  if exists (
    select lower(trim(email)) from public.email_whitelist
    where email is not null group by lower(trim(email)) having count(*) > 1
  ) then
    raise exception 'email_whitelist contains case-insensitive duplicate emails';
  end if;
end $$;

update public.email_whitelist set email = lower(trim(email)) where email <> lower(trim(email));
update public.scholars set email = lower(trim(email)) where email is not null and email <> lower(trim(email));
create unique index if not exists email_whitelist_email_lower_idx
  on public.email_whitelist (lower(email));
create unique index if not exists scholars_email_lower_idx on public.scholars (lower(email));
create unique index if not exists scholars_email_idx on public.scholars (email);

create or replace function public.is_whitelisted()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.email_whitelist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.email_whitelist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and "isAdmin" is true
  );
$$;

revoke all on function public.is_whitelisted() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_whitelisted() to authenticated;
grant execute on function public.is_admin() to authenticated;

drop view if exists public.scholar_contacts;
drop view if exists public.public_scholars;

create view public.public_scholars
with (security_barrier = true)
as
select
  id, status, year, first, middle, last, school, major,
  "currentCity", "currentState", description, company, "imageUrl", bio
from public.scholars
where status in ('Active', 'Graduated');

create view public.scholar_contacts
with (security_barrier = true)
as
select id, email, "cellPhone"
from public.scholars
where public.is_whitelisted();

revoke all on public.scholars from anon, authenticated;
revoke all on public.public_scholars from public;
revoke all on public.scholar_contacts from public;
grant select on public.public_scholars to anon, authenticated;
grant select on public.scholar_contacts to authenticated;
grant select, insert, update on public.scholars to authenticated;

alter table public.scholars enable row level security;
drop policy if exists "scholars_select_own_or_admin" on public.scholars;
drop policy if exists "scholars_update_own_or_admin" on public.scholars;
drop policy if exists "scholars_insert_admin" on public.scholars;
create policy "scholars_select_own_or_admin" on public.scholars
  for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email') or public.is_admin());
create policy "scholars_update_own_or_admin" on public.scholars
  for update to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email') or public.is_admin())
  with check (lower(email) = lower(auth.jwt() ->> 'email') or public.is_admin());
create policy "scholars_insert_admin" on public.scholars
  for insert to authenticated
  with check (public.is_admin());

alter table public.email_whitelist enable row level security;
revoke all on public.email_whitelist from anon, authenticated;
grant select on public.email_whitelist to authenticated;
drop policy if exists "whitelist_select_own_or_admin" on public.email_whitelist;
create policy "whitelist_select_own_or_admin" on public.email_whitelist
  for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email') or public.is_admin());

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  starts_on date not null,
  ends_on date,
  location text,
  description text,
  url text,
  member_only boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  check (ends_on is null or ends_on >= starts_on),
  check (status = 'draft' or published_at is not null)
);

create table if not exists public.news (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null,
  body text,
  published_at timestamptz,
  author text,
  cover_image text,
  category text not null check (category in ('news', 'spotlight')),
  scholar_id bigint references public.scholars(id) on delete set null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  check (status = 'draft' or published_at is not null)
);

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  type text not null check (type in ('Full-time', 'Internship', 'Part-time', 'Contract')),
  remote boolean not null default false,
  url text not null check (url ~ '^https?://'),
  posted_by text,
  posted_by_user_id uuid not null references auth.users(id) on delete cascade,
  posted_at timestamptz not null default now(),
  description text,
  expires_at date
);

create table if not exists public.mentorship_signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  user_email text not null,
  role text not null check (role in ('mentor', 'mentee')),
  areas text[] not null default '{}',
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_albums (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  event_date date,
  description text,
  cover_image text,
  bucket_path text,
  status text not null default 'draft' check (status in ('draft', 'published'))
);

alter table public.events enable row level security;
alter table public.news enable row level security;
alter table public.job_postings enable row level security;
alter table public.mentorship_signups enable row level security;
alter table public.gallery_albums enable row level security;

drop policy if exists "events_read_published" on public.events;
create policy "events_read_published" on public.events for select to anon, authenticated
  using (status = 'published' and published_at <= now());
drop policy if exists "news_read_published" on public.news;
create policy "news_read_published" on public.news for select to anon, authenticated
  using (status = 'published' and published_at <= now());
drop policy if exists "jobs_read_members" on public.job_postings;
drop policy if exists "jobs_insert_self" on public.job_postings;
create policy "jobs_read_members" on public.job_postings for select to authenticated
  using (public.is_whitelisted());
create policy "jobs_insert_self" on public.job_postings for insert to authenticated
  with check (posted_by_user_id = auth.uid() and public.is_whitelisted());
drop policy if exists "mentorship_own" on public.mentorship_signups;
create policy "mentorship_own" on public.mentorship_signups for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and user_email = auth.jwt() ->> 'email');
drop policy if exists "albums_read_members" on public.gallery_albums;
create policy "albums_read_members" on public.gallery_albums for select to authenticated
  using (status = 'published' and public.is_whitelisted());

revoke all on public.events, public.news, public.job_postings, public.mentorship_signups, public.gallery_albums from anon, authenticated;
grant select on public.events, public.news to anon, authenticated;
grant select, insert on public.job_postings to authenticated;
grant select, insert, update on public.mentorship_signups to authenticated;
grant select on public.gallery_albums to authenticated;

drop policy if exists "profile_pictures_read" on storage.objects;
drop policy if exists "profile_pictures_write_own" on storage.objects;
drop policy if exists "media_read_members" on storage.objects;
create policy "profile_pictures_read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'profile_pictures');
create policy "profile_pictures_write_own" on storage.objects for all to authenticated
  using (bucket_id = 'profile_pictures' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'profile_pictures' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media_read_members" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_whitelisted());

commit;
