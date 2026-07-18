'use client';

import React from 'react';
import { useActionState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';

import { submitMentorshipSignup } from '@/app/lib/actions';
import { MENTORSHIP_AREAS } from '@/app/constants/mentorship';
import { EXTERNAL_LINKS } from '@/app/constants/site';
import { useToast } from '@/app/hooks/use-toast';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { SubmitButton } from '@/app/components/buttons/submit-button';
import { cn } from '@/app/lib/utils';

type State = { errors?: { formErrors?: string }; success?: boolean };

export function MentorshipForm() {
  const [state, formAction] = useActionState<State, FormData>(submitMentorshipSignup, {});
  const { toast } = useToast();
  const [role, setRole] = React.useState<'mentor' | 'mentee'>('mentee');

  React.useEffect(() => {
    if (state?.errors?.formErrors) {
      toast({ title: 'Heads up', variant: 'destructive', description: state.errors.formErrors });
    }
  }, [state, toast]);

  if (state?.success) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-4 font-display text-xl font-semibold">You’re signed up!</h3>
        <p className="mt-2 text-muted-foreground">
          Thanks for joining the mentorship program. We’ll be in touch — in the meantime, say hi
          in the community chat.
        </p>
        <Button asChild className="mt-6">
          <a href={EXTERNAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" /> Open WhatsApp community
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border bg-card p-6 sm:p-8">
      {/* Role */}
      <fieldset>
        <legend className="text-sm font-medium">I’d like to be a…</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(['mentee', 'mentor'] as const).map((r) => (
            <label
              key={r}
              className={cn(
                'cursor-pointer rounded-xl border p-4 text-center transition-colors',
                role === r ? 'border-brand-navy bg-brand-navy/5' : 'border-border hover:bg-muted/40',
              )}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="sr-only"
              />
              <span className="block font-semibold capitalize">{r}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {r === 'mentee' ? 'I’m looking for guidance' : 'I want to guide a scholar'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Areas */}
      <fieldset className="mt-6">
        <legend className="text-sm font-medium">Areas of interest</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {MENTORSHIP_AREAS.map((area) => (
            <label
              key={area}
              className="cursor-pointer rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors has-[:checked]:border-brand-navy has-[:checked]:bg-brand-navy has-[:checked]:text-white"
            >
              <input type="checkbox" name="areas" value={area} className="sr-only" />
              {area}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Bio */}
      <div className="mt-6">
        <label htmlFor="mentorship-bio" className="text-sm font-medium">
          A little about you <span className="text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="mentorship-bio"
          name="bio"
          rows={4}
          placeholder="What you’re hoping to get out of mentorship, your field, your goals…"
          className="mt-2"
        />
      </div>

      <div className="mt-6">
        <SubmitButton>Join the mentorship program</SubmitButton>
      </div>
    </form>
  );
}
