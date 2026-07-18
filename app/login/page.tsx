import { LoginForm } from '@/app/login/login-form';
import { safeNextPath } from '@/app/lib/site-url';

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const requestedPath = (await searchParams).next;
  return <LoginForm nextPath={safeNextPath(Array.isArray(requestedPath) ? requestedPath[0] : requestedPath)} />;
}
