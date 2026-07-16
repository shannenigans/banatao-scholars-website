import { getOptionalViewer } from '@/app/lib/auth';
import { fetchScholarDirectory } from '@/app/lib/data';
import { ScholarsDirectory } from './scholars-directory';

export default async function ScholarsDirectoryPage() {
  const viewer = await getOptionalViewer();
  const result = await fetchScholarDirectory(viewer);
  return (
    <ScholarsDirectory
      initialScholars={result.data}
      showContacts={Boolean(viewer)}
      unavailable={result.unavailable}
    />
  );
}
