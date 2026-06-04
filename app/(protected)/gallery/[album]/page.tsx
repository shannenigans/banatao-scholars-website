'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Images, Loader2 } from 'lucide-react';

import { fetchAlbums, getMediaFromBucket } from '@/app/lib/actions';
import { GalleryAlbum, GalleryPhoto } from '@/app/constants/gallery';

const IGNORED_NAMES = ['.emptyFolderPlaceholder'];

const STORAGE_BASE = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hisjorhwwdqudqtqzidc.supabase.co'
).replace(/\/$/, '');

type BucketFile = { name: string };

export default function AlbumPage({ params }: { params: { album: string } }) {
  const [album, setAlbum] = React.useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = React.useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      const albums = await fetchAlbums();
      const found = albums.find((a) => a.slug === params.album) ?? null;
      if (!active) return;
      if (!found) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      setAlbum(found);

      let resolved: GalleryPhoto[] = found.photos ?? [];
      if (found.bucketPath) {
        const media = await getMediaFromBucket(found.bucketPath);
        const files = (media?.data ?? []) as BucketFile[];
        const fromBucket = files
          .filter((f) => f?.name && !IGNORED_NAMES.includes(f.name))
          .map((f) => ({
            src: `${STORAGE_BASE}/storage/v1/object/public/media/${found.bucketPath}/${f.name}`,
            alt: found.title,
          }));
        if (fromBucket.length > 0) resolved = fromBucket;
      }
      if (active) {
        setPhotos(resolved);
        setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [params.album]);

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All albums
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        {album?.title ?? (notFound ? 'Album not found' : 'Loading…')}
      </h1>
      {album?.description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{album.description}</p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading photos…
        </div>
      ) : photos.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl border">
              <Image
                src={photo.src}
                alt={photo.alt ?? `Photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border bg-muted/40 p-10 text-center">
          <Images className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">
            Photos for this album will appear here once they’re uploaded.
          </p>
        </div>
      )}
    </div>
  );
}
