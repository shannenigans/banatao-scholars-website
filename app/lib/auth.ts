import 'server-only';

import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { User } from '@supabase/supabase-js';

import { createClient } from '@/app/utils/supabase/server';

export type AuthenticatedViewer = {
  user: Pick<User, 'id' | 'email'> & { email: string };
  isAdmin: boolean;
};

export const getOptionalViewer = cache(async (): Promise<AuthenticatedViewer | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const email = data.user?.email?.trim().toLowerCase();
    if (error || !data.user || !email) return null;

    const { data: whitelist, error: whitelistError } = await supabase
      .from('email_whitelist')
      .select('email,isAdmin')
      .eq('email', email)
      .maybeSingle();

    if (whitelistError || !whitelist) return null;
    return {
      user: { id: data.user.id, email },
      isAdmin: whitelist.isAdmin === true,
    };
  } catch {
    return null;
  }
});

export async function requireViewer(): Promise<AuthenticatedViewer> {
  const viewer = await getOptionalViewer();
  if (!viewer) redirect('/login');
  return viewer;
}

export async function requireAdmin(): Promise<AuthenticatedViewer> {
  const viewer = await requireViewer();
  if (!viewer.isAdmin) redirect('/loginError');
  return viewer;
}
