'use client';

import React, { useActionState } from 'react';
import { CalendarPlus } from 'lucide-react';

import { submitEvent, type ActionState } from '@/app/lib/actions';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { SubmitButton } from '@/app/components/buttons/submit-button';

const initialState: ActionState = {};

export function SubmitEventForm() {
  const [state, formAction] = useActionState(submitEvent, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <details className="mt-12 rounded-2xl border bg-muted/40 p-6">
      <summary className="flex cursor-pointer items-center gap-2 font-semibold">
        <CalendarPlus className="h-4 w-4" /> Submit an event
      </summary>
      <p className="mt-1 text-sm text-muted-foreground">
        Share a gathering, panel, or mixer with the community. An admin reviews every
        submission before it goes live.
      </p>
      <form ref={formRef} action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="startsOn">Start date</Label>
          <Input id="startsOn" name="startsOn" type="date" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="endsOn">End date (optional)</Label>
          <Input id="endsOn" name="endsOn" type="date" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="url">Details / RSVP link</Label>
          <Input id="url" name="url" type="url" placeholder="https://" className="mt-2" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} className="mt-2" />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="memberOnly"
            name="memberOnly"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="memberOnly" className="font-normal">
            Scholars only (hide from the public site)
          </Label>
        </div>
        {state.errors?.formErrors && (
          <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.errors.formErrors}</p>
        )}
        {state.success && (
          <p role="status" className="text-sm text-green-700 sm:col-span-2">
            Submitted! An admin will review it before it's published.
          </p>
        )}
        <div className="max-w-40">
          <SubmitButton>Submit</SubmitButton>
        </div>
      </form>
    </details>
  );
}
