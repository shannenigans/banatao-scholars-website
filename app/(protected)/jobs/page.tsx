import { fetchJobs } from '@/app/lib/data';
import { JobsBoard } from './jobs-board';

export default async function JobsPage() {
  const result = await fetchJobs();
  return <JobsBoard jobs={result.data} unavailable={result.unavailable} />;
}
