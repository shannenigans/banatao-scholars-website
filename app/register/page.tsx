'use client'
import Link from 'next/link';
import { Form } from 'app/form';

import { SubmitButton } from '@/components/buttons/submit-button';
import { registerUser } from '@/app/lib/server';
import { useFormState } from 'react-dom';
import { useToast } from '@/app/hooks/use-toast';
import React from 'react';

export default function Login() {
  const [actionResult, formAction] = useFormState(registerUser, { errors: { formErrors: ''}});
  const { toast: errorToast } = useToast();

  React.useEffect(() => {
    if (actionResult.errors.formErrors !== '') {
      errorToast({
        title: 'Error',
        variant: 'destructive',
        description: actionResult.errors.formErrors
      });
    }
  }, [actionResult])

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
