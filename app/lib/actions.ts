'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin, requireViewer } from '@/app/lib/auth';
import { resolveSiteUrl } from '@/app/lib/site-url';
import { createAdminClient, createClient } from '@/app/utils/supabase/server';
import type { ScholarRow } from '@/app/types/database';
import type { PrivateScholarProfile } from '@/app/types/scholar';

export type ActionState = {
  errors?: { formErrors?: string };
  success?: boolean;
};

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
});

const optionalText = (max: number) =>
  z.preprocess((value) => (value === '' ? undefined : value), z.string().trim().max(max).optional());

const profileSchema = z.object({
  first: z.string().trim().min(2).max(50),
  last: z.string().trim().min(2).max(50),
  school: optionalText(100),
  major: optionalText(100),
  currentCity: optionalText(100),
  currentState: optionalText(50),
  bio: optionalText(1000),
  company: optionalText(100),
  description: optionalText(100),
  cellPhone: optionalText(30),
});

const jobSchema = z.object({
  title: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(120),
  url: z.string().trim().url().max(2048).refine((value) => /^https?:\/\//i.test(value), 'Use an HTTP(S) link.'),
  type: z.enum(['Full-time', 'Internship', 'Part-time', 'Contract']),
  location: optionalText(160),
  description: optionalText(2000),
});

const mentorshipSchema = z.object({
  role: z.enum(['mentor', 'mentee']),
  areas: z.array(z.string().trim().min(1).max(100)).max(12),
  bio: optionalText(1000),
});

function formError(message: string): ActionState {
  return { errors: { formErrors: message } };
}

export async function signInAsUser(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return formError('Enter a valid email and a password of at least 8 characters.');

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return formError('The email or password was not accepted.');
  } catch {
    return formError('Sign-in is temporarily unavailable. Please try again later.');
  }

  revalidatePath('/', 'layout');
  redirect('/portal');
}

export async function signup(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return formError('Enter a valid email and a password of at least 8 characters.');

  let allowed = false;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('email_whitelist')
      .select('email')
      .eq('email', parsed.data.email)
      .maybeSingle();
    allowed = !error && Boolean(data);
  } catch {
    return formError('Sign-up is temporarily unavailable. Please try again later.');
  }
  if (!allowed) {
    return formError('This email is not on the scholar list. Please contact an administrator.');
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp(parsed.data);
    if (error) return formError('The account could not be created. Please try again.');
  } catch {
    return formError('Sign-up is temporarily unavailable. Please try again later.');
  }

  revalidatePath('/', 'layout');
  redirect('/settings');
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Sign-out failed.');
  revalidatePath('/', 'layout');
  redirect('/login');
}

async function oauthUrl(provider: 'google' | 'linkedin_oidc') {
  try {
    const supabase = await createClient();
    const redirectTo = new URL('/auth/callback', resolveSiteUrl());
    redirectTo.searchParams.set('next', '/portal');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo.toString() },
    });
    return error ? undefined : data.url;
  } catch {
    return undefined;
  }
}

export async function signInWithGoogle() {
  return oauthUrl('google');
}

export async function signInWithLinkedIn() {
  return oauthUrl('linkedin_oidc');
}

export async function saveProfile(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireViewer();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return formError('Check the profile fields and try again.');

  const supabase = await createClient();
  const profilePic = formData.get('profilePic');
  let imageUrl: string | undefined;
  let uploadedPath: string | undefined;
  if (profilePic instanceof File && profilePic.size > 0) {
    if (profilePic.size > 2_000_000 || !['image/jpeg', 'image/png', 'image/webp'].includes(profilePic.type)) {
      return formError('Profile photos must be JPEG, PNG, or WebP files no larger than 2 MB.');
    }
    const extension = profilePic.type === 'image/png' ? 'png' : profilePic.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${viewer.user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('profile_pictures')
      .upload(path, profilePic, { cacheControl: '3600', contentType: profilePic.type, upsert: true });
    if (uploadError) return formError('The profile photo could not be uploaded.');
    uploadedPath = path;
    imageUrl = supabase.storage.from('profile_pictures').getPublicUrl(path).data.publicUrl;
  }

  const update: Partial<PrivateScholarProfile> = { ...parsed.data };
  if (imageUrl) update.imageUrl = imageUrl;
  const { data, error } = await supabase
    .from('scholars')
    .update(update)
    .eq('email', viewer.user.email)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    if (uploadedPath) await supabase.storage.from('profile_pictures').remove([uploadedPath]);
    return formError('Your scholar profile could not be updated. Please contact an administrator.');
  }

  revalidatePath('/settings');
  revalidatePath('/scholars');
  return { success: true };
}

export async function parseScholarData(rawData: unknown[]): Promise<ActionState> {
  await requireAdmin();
  if (!Array.isArray(rawData) || rawData.length < 2 || rawData.length > 1001) {
    return formError('Import a header row and between 1 and 1,000 scholar records.');
  }

  const rows = rawData.slice(1).filter(Array.isArray);
  const valueAt = (row: unknown[], index: number) => {
    const value = row[index];
    return value === undefined || value === null || value === '' ? undefined : String(value).trim();
  };
  const parsedRows: Partial<ScholarRow>[] = rows.map((row) => ({
    status: valueAt(row, 0), year: valueAt(row, 1), first: valueAt(row, 2),
    middle: valueAt(row, 3), last: valueAt(row, 4), school: valueAt(row, 5),
    major: valueAt(row, 6), email: valueAt(row, 7)?.toLowerCase(),
    oldEmails: valueAt(row, 8), cellPhone: valueAt(row, 9), schoolPhone: valueAt(row, 10),
    homePhone: valueAt(row, 11), schoolAddress: valueAt(row, 12), schoolAddress2: valueAt(row, 13),
    schoolCity: valueAt(row, 14), schoolState: valueAt(row, 15), schoolZip: valueAt(row, 16),
    homeAddress: valueAt(row, 17), homeCity: valueAt(row, 18), homeState: valueAt(row, 19),
    homeZip: valueAt(row, 20), parents: valueAt(row, 21), parentsContact: valueAt(row, 22),
    currentAddress: valueAt(row, 23), currentCity: valueAt(row, 24),
    currentState: valueAt(row, 25), currentZip: valueAt(row, 26), currentPhone: valueAt(row, 27),
    description: valueAt(row, 28), company: valueAt(row, 29), bio: valueAt(row, 30),
  }));

  if (parsedRows.some((row) => !row.first || !row.last || !row.email)) {
    return formError('Every imported record must include a first name, last name, and email.');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('scholars').upsert(parsedRows, { onConflict: 'email' });
  if (error) return formError('The scholar import failed validation or could not be saved.');
  revalidatePath('/scholars');
  return { success: true };
}

export async function submitJobPosting(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireViewer();
  const parsed = jobSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    url: formData.get('url'),
    type: formData.get('type'),
    location: formData.get('location'),
    description: formData.get('description'),
  });
  if (!parsed.success) return formError('Enter a title, company, valid HTTP(S) link, and job type.');

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('scholars')
    .select('first,last')
    .eq('email', viewer.user.email)
    .maybeSingle();
  const postedBy = [profile?.first, profile?.last].filter(Boolean).join(' ') || viewer.user.email;
  const { error } = await supabase.from('job_postings').insert({
    ...parsed.data,
    location: parsed.data.location ?? null,
    description: parsed.data.description ?? null,
    remote: false,
    posted_by: postedBy,
    posted_by_user_id: viewer.user.id,
  });
  if (error) return formError('We could not post that role right now.');
  revalidatePath('/jobs');
  return { success: true };
}

export async function submitMentorshipSignup(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireViewer();
  const parsed = mentorshipSchema.safeParse({
    role: formData.get('role'),
    areas: formData.getAll('areas'),
    bio: formData.get('bio'),
  });
  if (!parsed.success) return formError('Choose a mentorship role and check the submitted fields.');

  const supabase = await createClient();
  const { error } = await supabase.from('mentorship_signups').upsert(
    {
      user_id: viewer.user.id,
      user_email: viewer.user.email,
      role: parsed.data.role,
      areas: parsed.data.areas,
      bio: parsed.data.bio ?? null,
    },
    { onConflict: 'user_id' },
  );
  if (error) return formError('We could not record your mentorship sign-up right now.');
  return { success: true };
}
