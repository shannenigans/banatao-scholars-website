begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select plan(19);

select has_view('public', 'public_scholars', 'public scholar view exists');
select has_view('public', 'scholar_contacts', 'member contact view exists');
select has_table('public', 'job_postings', 'job postings table exists');
select has_table('public', 'mentorship_signups', 'mentorship table exists');
select has_table('public', 'news', 'news table exists');
select has_table('public', 'events', 'events table exists');
select ok(not has_table_privilege('anon', 'public.scholars', 'SELECT'), 'anon cannot select scholar base rows');
select ok(has_table_privilege('anon', 'public.public_scholars', 'SELECT'), 'anon can select public scholar view');
select ok(not has_table_privilege('anon', 'public.scholar_contacts', 'SELECT'), 'anon cannot select contacts');
select ok(has_table_privilege('authenticated', 'public.scholar_contacts', 'SELECT'), 'authenticated can query guarded contacts');
select ok(
  not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'public_scholars'
      and column_name in ('email', 'cellPhone', 'homeAddress', 'parentsContact')
  ),
  'public scholar view has no private columns'
);

insert into public.scholars (status, first, last, email, "cellPhone")
values ('Active', 'Policy', 'Test', 'member@example.test', '555-0100');
insert into public.email_whitelist (email, "isAdmin")
values ('member@example.test', false);
insert into public.events (title, starts_on, member_only, status, published_at)
values
  ('Policy public event', current_date, false, 'published', now() - interval '1 minute'),
  ('Policy member event', current_date, true, 'published', now() - interval '1 minute');

set local request.jwt.claims = '{"role":"anon"}';
set local role anon;
select is((select count(*) from public.public_scholars where first = 'Policy'), 1::bigint, 'anon sees the public scholar row');
select is((select count(*) from public.events where title like 'Policy % event'), 1::bigint, 'anon sees only the public event');
reset role;

set local request.jwt.claims = '{"role":"authenticated","email":"outsider@example.test","sub":"00000000-0000-0000-0000-000000000001"}';
set local role authenticated;
select is((select count(*) from public.scholar_contacts), 0::bigint, 'non-whitelisted user sees no contacts');
select is((select count(*) from public.scholars where first = 'Policy'), 0::bigint, 'non-whitelisted user sees no scholar base rows');
select is((select count(*) from public.events where title like 'Policy % event'), 1::bigint, 'non-whitelisted user sees only the public event');
reset role;

set local request.jwt.claims = '{"role":"authenticated","email":"member@example.test","sub":"00000000-0000-0000-0000-000000000002"}';
set local role authenticated;
select is((select count(*) from public.scholar_contacts), 1::bigint, 'whitelisted user sees contact rows');
select is((select count(*) from public.scholars where first = 'Policy'), 1::bigint, 'whitelisted user sees their own scholar base row');
select is((select count(*) from public.events where title like 'Policy % event'), 2::bigint, 'whitelisted user sees member events');
reset role;

select * from finish();
rollback;
