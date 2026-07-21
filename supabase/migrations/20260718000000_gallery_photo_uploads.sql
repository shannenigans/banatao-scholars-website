begin;

-- Admins upload event photos into the media bucket; regular whitelisted
-- scholars can only read (see media_read_members).
drop policy if exists "media_insert_admin" on storage.objects;
create policy "media_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

commit;
