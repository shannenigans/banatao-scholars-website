'use client';

import React, { useActionState } from 'react';
import { FolderPlus } from 'lucide-react';

import { createGalleryAlbum, type ActionState } from '@/app/lib/actions';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { SubmitButton } from '@/app/components/buttons/submit-button';

const initialState: ActionState = {};

export function CreateAlbumForm() {
  const [state, formAction] = useActionState(createGalleryAlbum, initialState);

  return (
    <details className="mb-8 rounded-2xl border bg-muted/40 p-6">
      <summary className="flex cursor-pointer items-center gap-2 font-semibold">
        <FolderPlus className="h-4 w-4" /> Create album
      </summary>
      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="eventDate">Event date</Label>
          <Input id="eventDate" name="eventDate" type="date" className="mt-2" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} className="mt-2" />
        </div>
        {state.errors?.formErrors && (
          <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.errors.formErrors}</p>
        )}
        <div className="max-w-40">
          <SubmitButton>Create</SubmitButton>
        </div>
      </form>
    </details>
  );
}
