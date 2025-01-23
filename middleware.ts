import { NextRequest } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';


export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
