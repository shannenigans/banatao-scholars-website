'use client'
import Link from 'next/link';
import { Form } from 'app/form';

import { SubmitButton } from '@/components/buttons/submit-button';
import { SocialSigninOptions } from '@/app/components/social-signin-options';
import { Separator } from '@/app/components/ui/separator';
import { useFormState } from 'react-dom';
import { signInAsUser } from '@/app/lib/server';

export default function Login() {
  const [actionResult, formAction] = useFormState(signInAsUser, { errors: { formErrors: ''}});
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <Form
          action={formAction}
        >
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
          <span className="text-muted-foreground text-sm font-medium">or sign in with</span>
          <Separator className="flex-1" />
        </div>
        <div className='p-6'>
          <SocialSigninOptions />
        </div>
      </div>
    </div>
  );
}
