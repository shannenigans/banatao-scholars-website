import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Images } from 'lucide-react';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchAlbumPhotos, fetchAlbums } from '@/app/lib/data';
import { PhotoGrid } from '@/app/components/marketing/photo-grid';
import { UploadPhotosForm } from './upload-photos-form';

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
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">{album.title}</h1>
      {album.description && <p className="mt-2 max-w-2xl text-muted-foreground">{album.description}</p>}

      {photos.length > 0 ? (
        <PhotoGrid photos={photos} />
      ) : (
        <div className="mt-12 rounded-2xl border bg-muted/40 p-10 text-center">
          <Images className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No photos have been published for this album.</p>
        </div>
      )}

      {viewer?.isAdmin && <UploadPhotosForm slug={slug} />}
    </div>
  );
}
