'use client';

import React from 'react';
import { useActionState } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';

import { submitJobPosting } from '@/app/lib/actions';
import { JOB_TYPES } from '@/app/constants/jobs';
import { useToast } from '@/app/hooks/use-toast';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { SubmitButton } from '@/app/components/buttons/submit-button';

type State = { errors?: { formErrors?: string }; success?: boolean };

export function JobPostingForm() {
  const [state, formAction] = useActionState<State, FormData>(submitJobPosting, {});
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (state?.errors?.formErrors) {
      toast({ title: 'Heads up', variant: 'destructive', description: state.errors.formErrors });
    }
    if (state?.success) {
      toast({ title: 'Posted!', description: 'Thanks for sharing a role with the network.' });
    }
  }, [state, toast]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline">
        <Plus className="h-4 w-4" /> Post a role
      </Button>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Share an opportunity</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {state?.success && (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" /> Posted — thank you!
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="job-title" className="text-sm font-medium">
            Role title
          </label>
          <Input id="job-title" name="title" required placeholder="Software Engineer" className="mt-2" />
        </div>
        <div>
          <label htmlFor="job-company" className="text-sm font-medium">
            Company
          </label>
          <Input id="job-company" name="company" required placeholder="Acme Inc." className="mt-2" />
        </div>
        <div>
          <label htmlFor="job-location" className="text-sm font-medium">
            Location
          </label>
          <Input id="job-location" name="location" placeholder="San Francisco, CA" className="mt-2" />
        </div>
        <div>
          <label htmlFor="job-type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="job-type"
            name="type"
            defaultValue="Full-time"
            className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="job-url" className="text-sm font-medium">
            Application link
          </label>
          <Input
            id="job-url"
            name="url"
            type="url"
            required
            placeholder="https://…"
            className="mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="job-description" className="text-sm font-medium">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="job-description"
            name="description"
            rows={3}
            placeholder="What the role is, who it's a fit for, referral notes…"
            className="mt-2"
          />
        </div>
      </div>

      <div className="mt-5">
        <SubmitButton>Post to the board</SubmitButton>
      </div>
    </form>
  );
}
