'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pencil, Trash2, Images } from 'lucide-react';

import { updateGalleryAlbumTitle, deleteAlbumPhoto } from '@/app/lib/actions';
import type { GalleryPhoto } from '@/app/constants/gallery';
import { PhotoGrid } from '@/app/components/marketing/photo-grid';
import { UploadPhotosForm } from './upload-photos-form';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';

export function AlbumContent({
  slug,
  title,
  description,
  photos,
  isAdmin,
}: {
  slug: string;
  title: string;
  description?: string;
  photos: GalleryPhoto[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [editMode, setEditMode] = React.useState(false);

  const [titleValue, setTitleValue] = React.useState(title);
  const [titleError, setTitleError] = React.useState<string | null>(null);
  const [savingTitle, startSavingTitle] = React.useTransition();

  const [deleteTarget, setDeleteTarget] = React.useState<GalleryPhoto | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleting, startDeleting] = React.useTransition();

  const handleToggleEdit = () => {
    if (editMode) {
      // Cancel: discard any unsaved title edits.
      setTitleValue(title);
      setTitleError(null);
    }
    setEditMode((prev) => !prev);
  };

  const handleSaveTitle = () => {
    setTitleError(null);
    startSavingTitle(async () => {
      const result = await updateGalleryAlbumTitle(slug, titleValue);
      if (result.error) {
        setTitleError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget?.path) return;
    setDeleteError(null);
    startDeleting(async () => {
      const result = await deleteAlbumPhoto(slug, deleteTarget.path as string);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="mt-4 flex items-start justify-between gap-4">
        {editMode ? (
          <div className="flex-1">
            <Label htmlFor="albumTitle" className="sr-only">Title</Label>
            <div className="flex gap-2">
              <Input
                id="albumTitle"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                className="font-display text-xl font-bold"
              />
              <Button
                type="button"
                onClick={handleSaveTitle}
                disabled={savingTitle || titleValue.trim() === title.trim()}
              >
                {savingTitle ? 'Saving…' : 'Save'}
              </Button>
            </div>
            {titleError && <p role="alert" className="mt-2 text-sm text-destructive">{titleError}</p>}
          </div>
        ) : (
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
          </div>
        )}

        {isAdmin && (
          <Button type="button" variant="outline" size="sm" onClick={handleToggleEdit}>
            <Pencil className="h-3.5 w-3.5" /> {editMode ? 'Cancel' : 'Edit album'}
          </Button>
        )}
      </div>

      {photos.length > 0 ? (
        editMode ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <div key={photo.path ?? photo.src} className="relative aspect-square overflow-hidden rounded-xl border">
                <Image
                  src={photo.src}
                  alt={photo.alt ?? `Photo ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
                {photo.path && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(photo)}
                    aria-label="Delete photo"
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )
      ) : (
        <div className="mt-12 rounded-2xl border bg-muted/40 p-10 text-center">
          <Images className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No photos have been published for this album.</p>
        </div>
      )}

      {isAdmin && !editMode && <UploadPhotosForm slug={slug} />}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title="Delete this photo?"
        description="This permanently removes the photo from the album. This can't be undone."
        confirmLabel="Delete"
        pending={deleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
