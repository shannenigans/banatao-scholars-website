'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

import { createAlbumPhotoUploadTickets, finalizeAlbumPhotoUpload } from '@/app/lib/actions';
import { createBrowserClient } from '@/app/utils/supabase/client';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

export function UploadPhotosForm({ slug }: { slug: string }) {
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = formRef.current?.elements.namedItem('photos') as HTMLInputElement | null;
    const files = input?.files ? Array.from(input.files) : [];
    if (files.length === 0) {
      setError('Select at least one photo to upload.');
      return;
    }

    setError(null);
    setSuccess(false);
    startTransition(async () => {
      // Bytes never touch this server: get signed upload tickets, then upload
      // straight from the browser to Supabase Storage. Avoids both the Server
      // Actions body size limit and Vercel's hard 4.5MB request cap.
      const result = await createAlbumPhotoUploadTickets(
        slug,
        files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
      );
      if (result.error || !result.tickets) {
        setError(result.error ?? 'Could not prepare the upload. Please try again.');
        return;
      }

      const supabase = createBrowserClient();
      const uploads = await Promise.all(
        result.tickets.map((ticket, index) =>
          supabase.storage.from('media').uploadToSignedUrl(ticket.path, ticket.token, files[index]),
        ),
      );
      if (uploads.some((upload) => upload.error)) {
        setError('One or more photos failed to upload. Please try again.');
        return;
      }

      await finalizeAlbumPhotoUpload(slug);
      setSuccess(true);
      formRef.current?.reset();
      router.refresh();
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 rounded-2xl border bg-muted/40 p-6">
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
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      {success && <p role="status" className="mt-3 text-sm text-green-700">Photos uploaded.</p>}
      <div className="mt-4 max-w-40">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Uploading…' : 'Upload'}
        </Button>
      </div>
    </form>
  );
}
