'use client';

import * as React from 'react';

import { GalleryPhoto } from '@/app/constants/gallery';
import { PhotoLightbox, PhotoThumbnail } from '@/app/components/marketing/photo-lightbox';

export function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <PhotoThumbnail key={photo.src} photo={photo} index={index} onOpen={setOpenIndex} />
        ))}
      </div>
      <PhotoLightbox
        photos={photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
