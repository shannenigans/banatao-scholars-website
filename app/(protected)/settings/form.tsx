'use client';

import React, { useActionState } from 'react';

import { saveProfile, type ActionState } from '@/app/lib/actions';
import type { PrivateScholarProfile } from '@/app/types/scholar';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { SubmitButton } from '@/app/components/buttons/submit-button';

const initialState: ActionState = {};

export function ProfileForm({ profile }: { profile: PrivateScholarProfile | null }) {
  const [state, formAction] = useActionState(saveProfile, initialState);

  if (!profile) {
    return (
      <p className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        We could not match this account to a scholar profile. Contact an administrator before
        editing profile details.
      </p>
    );
  }

  const fields = [
    ['first', 'First name', profile.first],
    ['last', 'Last name', profile.last],
    ['major', 'Major', profile.major],
    ['school', 'School', profile.school],
    ['description', 'Role', profile.description],
    ['company', 'Organization', profile.company],
    ['currentCity', 'City', profile.currentCity],
    ['currentState', 'State', profile.currentState],
    ['cellPhone', 'Cell phone', profile.cellPhone],
  ] as const;

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-56">
          <Avatar className="mx-auto h-40 w-40">
            <AvatarImage src={profile.imageUrl} alt={`${profile.first} ${profile.last}`} />
            <AvatarFallback>{profile.first.at(0)}{profile.last.at(0)}</AvatarFallback>
          </Avatar>
          <Label htmlFor="profilePic" className="mt-4 block">Profile photo</Label>
          <Input
            id="profilePic"
            name="profilePic"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2"
          />
          <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, or WebP; 2 MB maximum.</p>
        </div>

        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          {fields.map(([name, label, value]) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                defaultValue={value ?? ''}
                required={name === 'first' || name === 'last'}
                className="mt-2"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio ?? ''} className="mt-2" />
          </div>
        </div>
      </div>

      {state.errors?.formErrors && (
        <p role="alert" className="text-sm text-destructive">{state.errors.formErrors}</p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-green-700">Profile updated.</p>
      )}
      <div className="max-w-40">
        <SubmitButton>Save profile</SubmitButton>
      </div>
    </form>
  );
}
