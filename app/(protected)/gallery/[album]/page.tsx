import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchAlbumPhotos, fetchAlbums } from '@/app/lib/data';
import { AlbumContent } from './album-content';

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album: slug } = await params;
  const viewer = await getOptionalViewer();
  const { data: albums } = await fetchAlbums();
  const album = albums.find((candidate) => candidate.slug === slug);
  if (!album) notFound();
  const photos = await fetchAlbumPhotos(album);

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All albums
      </Link>
      <AlbumContent
        slug={slug}
        title={album.title}
        description={album.description}
        photos={photos}
        isAdmin={Boolean(viewer?.isAdmin)}
      />
    </div>
  );
}
