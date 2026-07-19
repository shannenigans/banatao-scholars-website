'use client'
import React from 'react';
import { unstable_rethrow } from 'next/navigation';
import { signOut } from "@/app/lib/actions";
import { useToast } from '@/app/hooks/use-toast';

export const SignOut = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, disabled, onClick, ...props }, ref) => {
    const [pending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const handleSignOut = () => {
      startTransition(async () => {
        try {
          await signOut();
        } catch (err) {
          unstable_rethrow(err);
          toast({
            title: 'Unable to sign out',
            variant: 'destructive',
            description: 'Please try again.',
          });
        }
      });
    };

    return (
        <button
          {...props}
          ref={ref}
          type="button"
          aria-busy={pending}
          disabled={disabled || pending}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) handleSignOut();
          }}
          className={`w-full text-left ${className ?? ''}`}
        >
          {pending ? 'Signing out…' : 'Sign out'}
        </button>
    )
});

SignOut.displayName = 'SignOut';
