import { getOptionalViewer } from '@/app/lib/auth';
import { fetchJobs } from '@/app/lib/data';
import { JobsBoard } from './jobs-board';

export default async function JobsPage() {
  const viewer = await getOptionalViewer();
  const result = await fetchJobs();
  return <JobsBoard jobs={result.data} unavailable={result.unavailable} currentUserId={viewer?.user.id} />;
}
