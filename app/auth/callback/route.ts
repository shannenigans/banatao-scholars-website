import { NextRequest, NextResponse } from 'next/server';

import { safeNextPath } from '@/app/lib/site-url';
import { createClient } from '@/app/utils/supabase/server';

function noStoreRedirect(request: NextRequest, pathname: string) {
  const response = NextResponse.redirect(new URL(pathname, request.url));
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return noStoreRedirect(request, '/loginError');

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    const email = data.user?.email?.trim().toLowerCase();
    if (error || !email) return noStoreRedirect(request, '/loginError');

    const { data: whitelist, error: whitelistError } = await supabase
      .from('email_whitelist')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    if (whitelistError || !whitelist) {
      await supabase.auth.signOut();
      return noStoreRedirect(request, '/loginError');
    }

    return noStoreRedirect(
      request,
      safeNextPath(request.nextUrl.searchParams.get('next')),
    );
  } catch {
    return noStoreRedirect(request, '/loginError');
  }
}
