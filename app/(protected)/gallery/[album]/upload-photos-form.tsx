'use client';

import React, { useActionState } from 'react';
import { Upload } from 'lucide-react';

import { uploadAlbumPhotos, type ActionState } from '@/app/lib/actions';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { SubmitButton } from '@/app/components/buttons/submit-button';

const initialState: ActionState = {};

export function UploadPhotosForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(uploadAlbumPhotos, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="mt-8 rounded-2xl border bg-muted/40 p-6">
      <input type="hidden" name="slug" value={slug} />
      <div className="flex items-center gap-2 font-semibold">
        <Upload className="h-4 w-4" /> Upload photos
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        JPEG, PNG, or WebP; 8 MB max per photo, up to 20 photos at a time.
      </p>
      <div className="mt-4">
        <Label htmlFor="photos" className="sr-only">Photos</Label>
        <Input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required />
      </div>
      {state.errors?.formErrors && (
        <p role="alert" className="mt-3 text-sm text-destructive">{state.errors.formErrors}</p>
      )}
      {state.success && (
        <p role="status" className="mt-3 text-sm text-green-700">Photos uploaded.</p>
      )}
      <div className="mt-4 max-w-40">
        <SubmitButton>Upload</SubmitButton>
      </div>
    </form>
  );
}
