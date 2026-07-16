'use client';

import React from 'react';
import { useActionState } from 'react';
import Link from 'next/link';

import { Form } from '@/app/form';
import { SocialSigninOptions } from '@/app/components/social-signin-options';
import { SubmitButton } from '@/app/components/buttons/submit-button';
import { Separator } from '@/app/components/ui/separator';
import { useToast } from '@/app/hooks/use-toast';
import { signInAsUser } from '@/app/lib/actions';

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [actionResult, formAction] = useActionState(signInAsUser, {});
  const { toast } = useToast();

  React.useEffect(() => {
    if (actionResult.errors?.formErrors) {
      toast({
        title: 'Unable to sign in',
        variant: 'destructive',
        description: actionResult.errors.formErrors,
      });
    }
  }, [actionResult, toast]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h1 className="text-xl font-semibold">Sign In</h1>
          <p className="text-sm text-gray-500">Use your email and password to sign in</p>
        </div>
        <Form action={formAction}>
          <input type="hidden" name="next" value={nextPath} />
          <SubmitButton>Sign in</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
          </p>
        </Form>
        <div className="flex items-center gap-4 px-16">
          <Separator className="flex-1" />
          <span className="text-sm font-medium text-muted-foreground">or sign in with</span>
          <Separator className="flex-1" />
        </div>
        <div className="p-6">
          <SocialSigninOptions nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
