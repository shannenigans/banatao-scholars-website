'use client';

import React from 'react';
import { Button } from "@/app/components/ui/button"
import { signInWithGoogle } from "@/app/lib/actions";
import { useToast } from '@/app/hooks/use-toast';
import Image from 'next/image';

export const GoogleSignInButton = ({ nextPath }: { nextPath: string }) => {
    const [pending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const handleSignIn = () => {
      startTransition(async () => {
        const result = await signInWithGoogle(nextPath);
        if (result.url) {
          window.location.assign(result.url);
          return;
        }
        toast({
          title: 'Unable to sign in',
          variant: 'destructive',
          description: result.error,
        });
      });
    }

    return (
        <Button
          id="google-sign-in"
          type="button"
          size="lg"
          variant="outline"
          aria-label="Sign in with Google"
          disabled={pending}
          onClick={handleSignIn}
        >
            <Image src="/google_icon.svg" height={30} width={30} alt="" aria-hidden="true" />
        </Button>
    )
}
