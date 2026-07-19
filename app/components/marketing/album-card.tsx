import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Images, ArrowRight, Calendar } from 'lucide-react';

import { GalleryAlbum } from '@/app/constants/gallery';

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/** Card linking to a photo album. Falls back to the album's first photo, then a brand gradient. */
export function AlbumCard({ album, coverImage }: { album: GalleryAlbum; coverImage?: string }) {
  const dateLabel = formatDate(album.date);
  const cover = coverImage ?? album.coverImage;
  return (
    <Link
      href={`/gallery/${album.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-gradient">
            <Images className="h-10 w-10 text-gold" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {dateLabel && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {dateLabel}
          </span>
        )}
        <h3 className="mt-2 font-display text-lg font-semibold">{album.title}</h3>
        {album.description && (
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
            {album.description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy">
          View album
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
