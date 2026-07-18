import { getOptionalViewer } from '@/app/lib/auth';
import { fetchScholarDirectory } from '@/app/lib/data';
import { ScholarsDirectory } from './scholars-directory';

export default async function ScholarsDirectoryPage() {
  const viewer = await getOptionalViewer();
  if (!viewer) {
    return <ScholarsDirectory initialScholars={[]} signedIn={false} unavailable={false} />;
  }

  const result = await fetchScholarDirectory(viewer);
  return <ScholarsDirectory initialScholars={result.data} signedIn unavailable={result.unavailable} />;
}
