begin;

-- Scholars can submit events and spotlight stories; both land as unpublished
-- drafts until an admin approves (publishes) or rejects (deletes) them.
alter table public.events
  add column if not exists submitted_by_user_id uuid references auth.users(id) on delete set null,
  add column if not exists submitted_by text;

alter table public.news
  add column if not exists submitted_by_user_id uuid references auth.users(id) on delete set null,
  add column if not exists submitted_by text;

drop policy if exists "events_insert_self" on public.events;
create policy "events_insert_self" on public.events
  for insert to authenticated
  with check (status = 'draft' and submitted_by_user_id = auth.uid() and public.is_whitelisted());

drop policy if exists "events_read_own_or_admin" on public.events;
create policy "events_read_own_or_admin" on public.events
  for select to authenticated
  using (submitted_by_user_id = auth.uid() or public.is_admin());

drop policy if exists "events_update_admin" on public.events;
create policy "events_update_admin" on public.events
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "events_delete_admin" on public.events;
create policy "events_delete_admin" on public.events
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "news_insert_self" on public.news;
create policy "news_insert_self" on public.news
  for insert to authenticated
  with check (status = 'draft' and submitted_by_user_id = auth.uid() and public.is_whitelisted());

drop policy if exists "news_read_own_or_admin" on public.news;
create policy "news_read_own_or_admin" on public.news
  for select to authenticated
  using (submitted_by_user_id = auth.uid() or public.is_admin());

drop policy if exists "news_update_admin" on public.news;
create policy "news_update_admin" on public.news
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "news_delete_admin" on public.news;
create policy "news_delete_admin" on public.news
  for delete to authenticated
  using (public.is_admin());

grant insert, update, delete on public.events to authenticated;
grant insert, update, delete on public.news to authenticated;

commit;
