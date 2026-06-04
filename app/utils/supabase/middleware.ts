import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Routes that require an authenticated, whitelisted scholar.
 * Everything else (landing, legacy, public scholar directory/profiles,
 * apply, events, auth pages) is public.
 */
const PROTECTED_PREFIXES = [
  '/portal',
  '/settings',
  '/gallery',
  '/admin',
  '/resources',
  '/mentorship',
  '/jobs',
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

type WhitelistRow = { email?: string; isAdmin?: boolean };

/**
 * Looks up the whitelist using the middleware's own (Edge-safe) Supabase
 * client. We deliberately do NOT call the `isEmailWhitelisted` server action
 * here — it pulls in `next/headers`, which is unavailable in the Edge
 * middleware runtime and would crash the whole site.
 */
async function getWhitelist(
  supabase: ReturnType<typeof createServerClient>,
  email: string,
): Promise<WhitelistRow[]> {
  const { data } = await supabase.from('email_whitelist').select().eq('email', email);
  return (data ?? []) as WhitelistRow[];
}

export async function updateSession(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const pathIsProtected = isProtected(request.nextUrl.pathname);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured (e.g. a preview without env vars), never 500
  // the site: render public routes and send protected routes to login.
  if (!supabaseUrl || !supabaseKey) {
    return pathIsProtected ? redirectToLogin(request) : NextResponse.next({ request });
  }

  const headers = new Headers();
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options}) => {
          headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
        });
      },
    },
  })

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const searchParams = new URLSearchParams(request.nextUrl.search);
  const code = searchParams.get('code');

  try {
    // For PKCE flow in OAuth, get code from url and validate user is authenticated
    if (code) {
      const { data: session } = await supabase.auth.exchangeCodeForSession(code);
      if (session.user?.email) {
        const whitelist = await getWhitelist(supabase, session.user.email);
        if (whitelist.length !== 1) {
          return NextResponse.rewrite(`${origin}/loginError`)
        }
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Unauthenticated users hitting a protected route get sent to login first.
    if (!user && pathIsProtected && !code) {
      return redirectToLogin(request);
    }

    // For authenticated users on protected routes, enforce the whitelist + admin access.
    if (user && user.email && pathIsProtected) {
      const whitelist = await getWhitelist(supabase, user.email);
      if (whitelist.length !== 1) {
        return NextResponse.rewrite(`${origin}/loginError`)
      }

      const isAdmin = whitelist[0]?.isAdmin ?? false;
      const needsAdmin = request.nextUrl.pathname.indexOf('/admin') >= 0;
      if (needsAdmin && !isAdmin) {
        return NextResponse.rewrite(`${origin}/loginError`)
      }
    }
  } catch {
    // Never crash the site on an auth/DB hiccup: protected routes go to login,
    // public routes still render.
    return pathIsProtected ? redirectToLogin(request) : NextResponse.next({ request });
  }

  const newResponse = NextResponse.next({request, headers})
  const supabaseCookies: ResponseCookie[] = supabaseResponse.cookies.getAll();

  // make sure to set authorization tokens in headers, otherwise can't login via code
  supabaseCookies.forEach((cookie) => {
   headers.append('Set-Cookie', serializeCookieHeader(cookie.name, cookie.value, {}))
  })

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return newResponse
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
