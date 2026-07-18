import { NextRequest } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';


export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)'],
};
