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

  if exists (
    select lower(trim(email)) from public.scholars
    where email is not null group by lower(trim(email)) having count(*) > 1
  ) then
    raise exception 'scholars contains case-insensitive duplicate emails';
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
    where lower(email) = lower(coalesce(
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email',
      ''
    ))
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
    where lower(email) = lower(coalesce(
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email',
      ''
    ))
      and "isAdmin" is true
  );
$$;

revoke all on function public.is_whitelisted() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_whitelisted() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_whitelisted() to anon;

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
-- Supabase's DDL event trigger grants new relations to its API roles, so
-- revoking only from PUBLIC would leave these views writable and expose the
-- private contact view to anon.
revoke all on public.public_scholars from public, anon, authenticated;
revoke all on public.scholar_contacts from public, anon, authenticated;
grant select on public.public_scholars to anon, authenticated;
grant select on public.scholar_contacts to authenticated;
grant select, insert, update on public.scholars to authenticated;

alter table public.scholars enable row level security;
drop policy if exists "scholars_select_own_or_admin" on public.scholars;
drop policy if exists "scholars_update_own_or_admin" on public.scholars;
drop policy if exists "scholars_insert_admin" on public.scholars;
create policy "scholars_select_own_or_admin" on public.scholars
  for select to authenticated
  using (
    lower(email) = lower(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
    or public.is_admin()
  );
create policy "scholars_update_own_or_admin" on public.scholars
  for update to authenticated
  using (
    lower(email) = lower(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
    or public.is_admin()
  )
  with check (
    lower(email) = lower(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
    or public.is_admin()
  );
create policy "scholars_insert_admin" on public.scholars
  for insert to authenticated
  with check (public.is_admin());

alter table public.email_whitelist enable row level security;
revoke all on public.email_whitelist from anon, authenticated;
grant select on public.email_whitelist to authenticated;
drop policy if exists "whitelist_select_own_or_admin" on public.email_whitelist;
create policy "whitelist_select_own_or_admin" on public.email_whitelist
  for select to authenticated
  using (
    lower(email) = lower(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
    or public.is_admin()
  );

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

-- Earlier application versions queried legacy camelCase/date columns from
-- manually-created tables. Add the canonical schema without dropping those
-- columns so this migration is recoverable and safe after partial rollouts.
alter table public.events
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists title text,
  add column if not exists starts_on date,
  add column if not exists ends_on date,
  add column if not exists location text,
  add column if not exists description text,
  add column if not exists url text,
  add column if not exists member_only boolean not null default false,
  add column if not exists status text not null default 'draft',
  add column if not exists published_at timestamptz;

alter table public.news
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists excerpt text,
  add column if not exists body text,
  add column if not exists published_at timestamptz,
  add column if not exists author text,
  add column if not exists cover_image text,
  add column if not exists category text,
  add column if not exists scholar_id bigint references public.scholars(id) on delete set null,
  add column if not exists featured boolean not null default false,
  add column if not exists status text not null default 'draft';

alter table public.job_postings
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists title text,
  add column if not exists company text,
  add column if not exists location text,
  add column if not exists type text,
  add column if not exists remote boolean not null default false,
  add column if not exists url text,
  add column if not exists posted_by text,
  add column if not exists posted_by_user_id uuid references auth.users(id) on delete cascade,
  add column if not exists posted_at timestamptz not null default now(),
  add column if not exists description text,
  add column if not exists expires_at date;

alter table public.mentorship_signups
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists user_email text,
  add column if not exists role text,
  add column if not exists areas text[] not null default '{}',
  add column if not exists bio text,
  add column if not exists created_at timestamptz not null default now();

alter table public.gallery_albums
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists event_date date,
  add column if not exists description text,
  add column if not exists cover_image text,
  add column if not exists bucket_path text,
  add column if not exists status text not null default 'draft';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'date'
  ) then
    execute 'update public.events set starts_on = coalesce(starts_on, date)';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'endDate'
  ) then
    execute 'update public.events set ends_on = coalesce(ends_on, "endDate")';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'memberOnly'
  ) then
    execute 'update public.events set member_only = coalesce("memberOnly", false) where member_only is false';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'news' and column_name = 'date'
  ) then
    execute 'update public.news set published_at = coalesce(published_at, date::timestamptz)';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'news' and column_name = 'coverImage'
  ) then
    execute 'update public.news set cover_image = coalesce(cover_image, "coverImage")';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'news' and column_name = 'scholarId'
  ) then
    execute 'update public.news set scholar_id = coalesce(scholar_id, "scholarId")';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'job_postings' and column_name = 'expiresAt'
  ) then
    execute 'update public.job_postings set expires_at = coalesce(expires_at, "expiresAt")';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'gallery_albums' and column_name = 'date'
  ) then
    execute 'update public.gallery_albums set event_date = coalesce(event_date, date)';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'gallery_albums' and column_name = 'coverImage'
  ) then
    execute 'update public.gallery_albums set cover_image = coalesce(cover_image, "coverImage")';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'gallery_albums' and column_name = 'bucketPath'
  ) then
    execute 'update public.gallery_albums set bucket_path = coalesce(bucket_path, "bucketPath")';
  end if;
end $$;

-- Records without complete publication metadata remain drafts until reviewed.
update public.events set status = 'draft'
where status is null or status not in ('draft', 'published')
  or (status = 'published' and (title is null or published_at is null or starts_on is null));
update public.news set status = 'draft'
where status is null or status not in ('draft', 'published')
  or (status = 'published' and (
    slug is null or title is null or excerpt is null or published_at is null
    or category not in ('news', 'spotlight')
  ));
update public.gallery_albums set status = 'draft'
where status is null or status not in ('draft', 'published')
  or (status = 'published' and (slug is null or title is null));
update public.events set member_only = false where member_only is null;
update public.news set featured = false where featured is null;
update public.job_postings set remote = false where remote is null;
update public.mentorship_signups set areas = '{}' where areas is null;

alter table public.events alter column status set default 'draft', alter column status set not null;
alter table public.news alter column status set default 'draft', alter column status set not null;
alter table public.gallery_albums alter column status set default 'draft', alter column status set not null;

create unique index if not exists events_id_idx on public.events (id);
create unique index if not exists news_slug_idx on public.news (slug);
create unique index if not exists job_postings_id_idx on public.job_postings (id);
create unique index if not exists mentorship_signups_user_id_idx
  on public.mentorship_signups (user_id);
create unique index if not exists gallery_albums_slug_idx on public.gallery_albums (slug);

do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.events'::regclass and conname = 'events_status_allowed') then
    alter table public.events add constraint events_status_allowed
      check (status in ('draft', 'published')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.events'::regclass and conname = 'events_publish_complete') then
    alter table public.events add constraint events_publish_complete
      check (status = 'draft' or (title is not null and published_at is not null and starts_on is not null)) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.events'::regclass and conname = 'events_dates_ordered') then
    alter table public.events add constraint events_dates_ordered
      check (ends_on is null or starts_on is null or ends_on >= starts_on) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.news'::regclass and conname = 'news_status_allowed') then
    alter table public.news add constraint news_status_allowed
      check (status in ('draft', 'published')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.news'::regclass and conname = 'news_publish_complete') then
    alter table public.news add constraint news_publish_complete
      check (
        status = 'draft' or (
          slug is not null and title is not null and excerpt is not null and published_at is not null
          and category in ('news', 'spotlight')
        )
      ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.job_postings'::regclass and conname = 'job_postings_type_allowed') then
    alter table public.job_postings add constraint job_postings_type_allowed
      check (type in ('Full-time', 'Internship', 'Part-time', 'Contract')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.job_postings'::regclass and conname = 'job_postings_http_url') then
    alter table public.job_postings add constraint job_postings_http_url
      check (url ~ '^https?://') not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.job_postings'::regclass and conname = 'job_postings_required_fields') then
    alter table public.job_postings add constraint job_postings_required_fields
      check (title is not null and company is not null and type is not null and url is not null) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.mentorship_signups'::regclass and conname = 'mentorship_role_allowed') then
    alter table public.mentorship_signups add constraint mentorship_role_allowed
      check (role in ('mentor', 'mentee')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.mentorship_signups'::regclass and conname = 'mentorship_required_fields') then
    alter table public.mentorship_signups add constraint mentorship_required_fields
      check (user_id is not null and user_email is not null and role is not null) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.gallery_albums'::regclass and conname = 'gallery_status_allowed') then
    alter table public.gallery_albums add constraint gallery_status_allowed
      check (status in ('draft', 'published')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.gallery_albums'::regclass and conname = 'gallery_publish_complete') then
    alter table public.gallery_albums add constraint gallery_publish_complete
      check (status = 'draft' or (slug is not null and title is not null)) not valid;
  end if;
end $$;

alter table public.events enable row level security;
alter table public.news enable row level security;
alter table public.job_postings enable row level security;
alter table public.mentorship_signups enable row level security;
alter table public.gallery_albums enable row level security;

drop policy if exists "events_read_published" on public.events;
create policy "events_read_published" on public.events for select to anon, authenticated
  using (
    status = 'published'
    and published_at <= now()
    and (member_only is false or public.is_whitelisted())
  );
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
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and user_email = nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'
  );
drop policy if exists "albums_read_members" on public.gallery_albums;
create policy "albums_read_members" on public.gallery_albums for select to authenticated
  using (status = 'published' and public.is_whitelisted());

revoke all on public.events, public.news, public.job_postings, public.mentorship_signups, public.gallery_albums from anon, authenticated;
grant select on public.events, public.news to anon, authenticated;
grant select, insert on public.job_postings to authenticated;
grant select, insert, update on public.mentorship_signups to authenticated;
grant select on public.gallery_albums to authenticated;

do $$
declare
  sequence_name text;
begin
  sequence_name := pg_get_serial_sequence('public.scholars', 'id');
  if sequence_name is not null then
    execute format('grant usage, select on sequence %s to authenticated', sequence_name);
  end if;
end $$;

insert into storage.buckets (id, name)
values
  ('profile_pictures', 'profile_pictures'),
  ('media', 'media')
on conflict (id) do update set name = excluded.name;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'storage' and table_name = 'buckets' and column_name = 'public'
  ) then
    execute 'update storage.buckets set public = (id = ''profile_pictures'') where id in (''profile_pictures'', ''media'')';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'storage' and table_name = 'buckets' and column_name = 'file_size_limit'
  ) then
    execute 'update storage.buckets set file_size_limit = case when id = ''profile_pictures'' then 2000000 else null end where id in (''profile_pictures'', ''media'')';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'storage' and table_name = 'buckets' and column_name = 'allowed_mime_types'
  ) then
    execute 'update storage.buckets set allowed_mime_types = case when id = ''profile_pictures'' then array[''image/jpeg'', ''image/png'', ''image/webp''] else null end where id in (''profile_pictures'', ''media'')';
  end if;
end $$;

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
