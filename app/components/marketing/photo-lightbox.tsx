'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/app/lib/utils';
import { GalleryPhoto } from '@/app/constants/gallery';

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const photo = index !== null ? photos[index] : null;

  const goTo = React.useCallback(
    (next: number) => onIndexChange((next + photos.length) % photos.length),
    [onIndexChange, photos.length],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (index === null) return;
    if (event.key === 'ArrowLeft') goTo(index - 1);
    if (event.key === 'ArrowRight') goTo(index + 1);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <Dialog.Title className="sr-only">{photo?.alt ?? photo?.caption ?? 'Photo'}</Dialog.Title>
          <Dialog.Close className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white/90 transition hover:bg-black/70 hover:text-white">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {index !== null && photos.length > 1 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 transition hover:bg-black/70 hover:text-white sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous photo</span>
            </button>
          )}

          {photo && (
            <div className="relative h-[75vh] w-full max-w-5xl">
              <Image
                src={photo.src}
                alt={photo.alt ?? 'Photo'}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          )}

          {index !== null && photos.length > 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 transition hover:bg-black/70 hover:text-white sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next photo</span>
            </button>
          )}

          <div className="flex max-w-2xl flex-col items-center gap-1 text-center">
            {photo?.caption && <p className="text-sm text-white/90">{photo.caption}</p>}
            {photos.length > 1 && (
              <p className="text-xs text-white/60">
                {index !== null ? index + 1 : 0} / {photos.length}
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PhotoThumbnail({
  photo,
  index,
  onOpen,
  className,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: (index: number) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        'group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border',
        className,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt ?? `Photo ${index + 1}`}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  );
}
