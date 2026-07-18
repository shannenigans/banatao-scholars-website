import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

import { isProtectedPath } from '@/app/lib/protected-routes';
import type { Database } from '@/app/types/database';

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  if (pathname === '/login') {
    url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  }
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  const protectedRoute = isProtectedPath(request.nextUrl.pathname);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return protectedRoute ? redirectTo(request, '/login') : NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!protectedRoute) return response;
    const email = data.user?.email?.trim().toLowerCase();
    if (error || !data.user || !email) return redirectTo(request, '/login');

    const { data: whitelist, error: whitelistError } = await supabase
      .from('email_whitelist')
      .select('email,isAdmin')
      .eq('email', email)
      .maybeSingle();
    if (whitelistError || !whitelist) return redirectTo(request, '/loginError');
    if (request.nextUrl.pathname.startsWith('/admin') && !whitelist.isAdmin) {
      return redirectTo(request, '/loginError');
    }
    return response;
  } catch {
    return protectedRoute ? redirectTo(request, '/login') : response;
  }
}
