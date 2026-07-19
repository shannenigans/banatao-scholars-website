import React from 'react';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchAlbumCoverImage, fetchAlbums } from '@/app/lib/data';
import { AlbumCard } from '@/app/components/marketing/album-card';
import { CreateAlbumForm } from './create-album-form';

export default async function GalleryPage() {
  const viewer = await getOptionalViewer();
  const { data: albums, unavailable } = await fetchAlbums();
  const coverImages = await Promise.all(albums.map((album) => fetchAlbumCoverImage(album)));

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Photo Gallery</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Moments from retreats, mixers, and gatherings across the Banatao Scholars community.
        </p>
      </div>

      {viewer?.isAdmin && <div className="mt-8"><CreateAlbumForm /></div>}

      {albums.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album, index) => (
            <AlbumCard key={album.slug} album={album} coverImage={coverImages[index]} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-xl border bg-muted/40 p-6 text-center text-muted-foreground">
          {unavailable ? 'The gallery is temporarily unavailable.' : 'No albums have been published yet.'}
        </p>
      )}
    </div>
  );
}
