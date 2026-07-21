begin;

drop policy if exists "jobs_delete_own" on public.job_postings;
create policy "jobs_delete_own" on public.job_postings
  for delete to authenticated
  using (posted_by_user_id = auth.uid());

grant delete on public.job_postings to authenticated;

commit;
