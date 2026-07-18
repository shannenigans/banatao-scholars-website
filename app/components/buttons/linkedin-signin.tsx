'use client';

import React from 'react';
import { Button } from "@/app/components/ui/button"
import { signInWithLinkedIn } from "@/app/lib/actions"
import { useToast } from '@/app/hooks/use-toast';
import Image from 'next/image';

export const LinkedInSigninButton = ({ nextPath }: { nextPath: string }) => {
    const [pending, startTransition] = React.useTransition();
    const { toast } = useToast();

    const handleSignIn = () => {
      startTransition(async () => {
        const result = await signInWithLinkedIn(nextPath);
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
          id="linkedin-sign-in"
          type="button"
          size="lg"
          variant="outline"
          aria-label="Sign in with LinkedIn"
          disabled={pending}
          onClick={handleSignIn}
        >
            <Image src="/linkedin_icon.svg" height={30} width={30} alt="" aria-hidden="true" />
        </Button>
    )
}
