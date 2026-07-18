'use client'
import React from 'react';
import { useActionState } from 'react';

import Link from 'next/link';
import { Form } from 'app/form';

import { SubmitButton } from '@/components/buttons/submit-button';
import { signup } from '@/app/lib/actions';
import { SIGNUP_NOTICE } from '@/app/lib/auth-messages';
import { useToast } from '@/app/hooks/use-toast';

export default function Login() {
  const [actionResult, formAction] = useActionState(signup, { errors: { formErrors: ''}});
  const { toast } = useToast();

  React.useEffect(() => {
    if (actionResult.errors?.formErrors) {
      toast({
        title: 'Unable to sign up',
        variant: 'destructive',
        description: actionResult.errors.formErrors
      });
    }
    if (actionResult.success) {
      toast({
        title: 'Check your email',
        description: SIGNUP_NOTICE,
      });
    }
  }, [actionResult, toast])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <Form action={formAction}>
          <SubmitButton>Sign Up</SubmitButton>
          {actionResult.success && (
            <p role="status" className="rounded-md border bg-white p-3 text-sm text-gray-700">
              {SIGNUP_NOTICE}
            </p>
          )}
          <p className="text-center text-sm text-gray-600">
            {'Already have an account? '}
            <Link href="/login" className="font-semibold text-gray-800">
              Sign in
            </Link>
            {' instead.'}
          </p>
        </Form>
      </div>
    </div>
  );
}
