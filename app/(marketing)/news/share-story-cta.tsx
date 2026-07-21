'use client';

import React, { useActionState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Sparkles, X } from 'lucide-react';

import { submitStory, type ActionState } from '@/app/lib/actions';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { SubmitButton } from '@/app/components/buttons/submit-button';

const initialState: ActionState = {};

export function ShareStoryCta() {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(submitStory, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border bg-brand-gradient p-8 text-center text-white shadow-sm sm:flex-row sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Sparkles className="h-7 w-7 text-gold" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-semibold">Something cool? Share your story</h2>
          <p className="mt-1 text-white/80">
            New role, published research, a launch, an award — tell the community. Every
            story is reviewed before it's featured.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="shrink-0 bg-gold text-brand-navy-deep hover:bg-brand-gold-soft"
          onClick={() => setOpen(true)}
        >
          Share your story
        </Button>
      </div>

      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-0 z-[60] flex items-center justify-center p-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="w-full max-w-lg rounded-2xl border bg-background p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <Dialog.Title className="font-display text-lg font-semibold">Share your story</Dialog.Title>
                <Dialog.Close className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                An admin reviews every submission before it's published as a spotlight.
              </Dialog.Description>

              <form ref={formRef} action={formAction} className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="storyName">Your name</Label>
                  <Input id="storyName" name="name" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="storyTitle">Title</Label>
                  <Input id="storyTitle" name="title" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="storyExcerpt">Short summary</Label>
                  <Textarea id="storyExcerpt" name="excerpt" rows={2} required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="storyBody">Full story (optional)</Label>
                  <Textarea id="storyBody" name="body" rows={5} className="mt-2" />
                </div>
                {state.errors?.formErrors && (
                  <p role="alert" className="text-sm text-destructive">{state.errors.formErrors}</p>
                )}
                {state.success && (
                  <p role="status" className="text-sm text-green-700">
                    Submitted! An admin will review it before it's published.
                  </p>
                )}
                <div className="max-w-40">
                  <SubmitButton>Submit</SubmitButton>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
