import { isEmailWhitelisted } from '@/app/lib/actions';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const headers = new Headers();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  // For PKCE flow in OAuth, get code from url and validate user is authenticated
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const code = searchParams.get('code');
  let emailIsWhiteListed = true;
  let emailIsWhiteListedQuery = undefined;
  if (code) {
    const { data: session} = await supabase.auth.exchangeCodeForSession(code);

    if (session.user?.email) {
      emailIsWhiteListedQuery = await isEmailWhitelisted(session.user.email)
      emailIsWhiteListed = emailIsWhiteListedQuery  ? emailIsWhiteListedQuery?.length === 1 : false;
      if (!emailIsWhiteListed) {
        return NextResponse.rewrite('http://localhost:3000/loginError')
      }
    }
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (user && user.email) {
    emailIsWhiteListedQuery = await isEmailWhitelisted(user.email)
    emailIsWhiteListed = emailIsWhiteListedQuery  ? emailIsWhiteListedQuery?.length === 1 : false;
    if (!emailIsWhiteListed) {
      return NextResponse.rewrite('http://localhost:3000/loginError')
    }
  }
  
  const bypassPaths = [
    '/auth/v1/callback',
    '/login',
    '/auth',
    '/register',
    '/error'
  ];

  const isAdmin = emailIsWhiteListedQuery ? emailIsWhiteListedQuery[0].isAdmin : false;
  const isValidAdminAccess = request.nextUrl.pathname.indexOf('/admin') >= 0 ? isAdmin : true;

  if (!isValidAdminAccess) {
    return NextResponse.rewrite('http://localhost:3000/loginError')
  }

  if (
    !user &&
    !bypassPaths.some(path => request.nextUrl.pathname.startsWith(path)) &&
    request.nextUrl.pathname.indexOf('.svg') < 0 &&
    !code
  ) {
    // no user, potentially respond by redirecting the user to the login page
    return redirectToLogin(request);
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