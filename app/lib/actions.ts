'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin, requireViewer } from '@/app/lib/auth';
import { resolveSiteUrl, safeNextPath } from '@/app/lib/site-url';
import {
  hasValidImageSignature,
  profilePicturePathFromPublicUrl,
  type ProfileImageMime,
} from '@/app/lib/uploads';
import { createAdminClient, createAnonymousClient, createClient } from '@/app/utils/supabase/server';
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

const IMAGE_UPLOAD_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;

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

const scholarImportSchema = z.object({
  status: optionalText(50),
  year: optionalText(20),
  first: z.string().trim().min(1).max(100),
  middle: optionalText(100),
  last: z.string().trim().min(1).max(100),
  school: optionalText(160),
  major: optionalText(160),
  email: z.string().trim().toLowerCase().email().max(254),
  oldEmails: optionalText(1000),
  cellPhone: optionalText(50),
  schoolPhone: optionalText(50),
  homePhone: optionalText(50),
  schoolAddress: optionalText(240),
  schoolAddress2: optionalText(240),
  schoolCity: optionalText(100),
  schoolState: optionalText(100),
  schoolZip: optionalText(30),
  homeAddress: optionalText(240),
  homeCity: optionalText(100),
  homeState: optionalText(100),
  homeZip: optionalText(30),
  parents: optionalText(300),
  parentsContact: optionalText(300),
  currentAddress: optionalText(240),
  currentCity: optionalText(100),
  currentState: optionalText(100),
  currentZip: optionalText(30),
  currentPhone: optionalText(50),
  description: optionalText(500),
  company: optionalText(160),
  bio: optionalText(5000),
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
  redirect(safeNextPath(formData.get('next')));
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
  // Return the same response for ineligible, existing, and newly-created
  // accounts so this public action cannot be used to enumerate the allowlist.
  if (!allowed) return { success: true };

  try {
    // Do not persist the signup response's session into browser cookies. This
    // keeps the public response indistinguishable when email confirmation is
    // disabled and requires every new account to sign in explicitly.
    const supabase = createAnonymousClient();
    const { error } = await supabase.auth.signUp(parsed.data);
    if (error) return { success: true };
  } catch {
    return formError('Sign-up is temporarily unavailable. Please try again later.');
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Sign-out failed.');
  revalidatePath('/', 'layout');
  redirect('/login');
}

export type OAuthResult = { url?: string; error?: string };

async function oauthUrl(
  provider: 'google' | 'linkedin_oidc',
  requestedPath?: string,
): Promise<OAuthResult> {
  try {
    const supabase = await createClient();
    const redirectTo = new URL('/auth/callback', resolveSiteUrl());
    redirectTo.searchParams.set('next', safeNextPath(requestedPath));
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo.toString() },
    });
    return error || !data.url
      ? { error: 'Single sign-on is temporarily unavailable.' }
      : { url: data.url };
  } catch {
    return { error: 'Single sign-on is temporarily unavailable.' };
  }
}

export async function signInWithGoogle(requestedPath?: string) {
  return oauthUrl('google', requestedPath);
}

export async function signInWithLinkedIn(requestedPath?: string) {
  return oauthUrl('linkedin_oidc', requestedPath);
}

export async function saveProfile(_state: ActionState, formData: FormData): Promise<ActionState> {
  const viewer = await requireViewer();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return formError('Check the profile fields and try again.');

  const supabase = await createClient();
  const profilePic = formData.get('profilePic');
  let imageUrl: string | undefined;
  let uploadedPath: string | undefined;
  let previousImagePath: string | null = null;
  if (profilePic instanceof File && profilePic.size > 0) {
    if (
      profilePic.size > 2_000_000 ||
      !IMAGE_UPLOAD_MIMES.includes(profilePic.type as ProfileImageMime)
    ) {
      return formError('Profile photos must be JPEG, PNG, or WebP files no larger than 2 MB.');
    }
    const mime = profilePic.type as ProfileImageMime;
    const signature = new Uint8Array(await profilePic.slice(0, 12).arrayBuffer());
    if (!hasValidImageSignature(signature, mime)) {
      return formError('The selected file does not contain a valid JPEG, PNG, or WebP image.');
    }

    const { data: currentProfile } = await supabase
      .from('scholars')
      .select('imageUrl')
      .eq('email', viewer.user.email)
      .maybeSingle();
    previousImagePath = profilePicturePathFromPublicUrl(
      currentProfile?.imageUrl ?? null,
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      viewer.user.id,
    );

    const extension = profilePic.type === 'image/png' ? 'png' : profilePic.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${viewer.user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('profile_pictures')
      .upload(path, profilePic, { cacheControl: '3600', contentType: profilePic.type, upsert: false });
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
  if (previousImagePath && previousImagePath !== uploadedPath) {
    await supabase.storage.from('profile_pictures').remove([previousImagePath]);
  }

  revalidatePath('/settings');
  revalidatePath('/scholars');
  return { success: true };
}

const MAX_ALBUM_PHOTOS_PER_UPLOAD = 20;

function extensionForImageMime(mime: ProfileImageMime): string {
  return mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
}

export type PhotoUploadRequest = { name: string; type: string; size: number };
export type PhotoUploadTicket = { name: string; path: string; token: string };
export type PhotoUploadTicketResult =
  | { tickets: PhotoUploadTicket[]; error?: undefined }
  | { tickets?: undefined; error: string };

/**
 * Issues signed upload URLs so the browser can upload photo bytes straight to
 * Supabase Storage, bypassing the Server Actions body size limit (and
 * Vercel's hard 4.5MB request body cap in production) entirely. Admin check
 * and file validation happen here; the actual bytes never pass through this
 * server. The `media` bucket's file_size_limit/allowed_mime_types (see
 * supabase/migrations/20260719000000_media_bucket_limits.sql) enforce type
 * and size at the storage layer, since we can't inspect real file signatures
 * without the bytes.
 */
export async function createAlbumPhotoUploadTickets(
  slug: string,
  files: PhotoUploadRequest[],
): Promise<PhotoUploadTicketResult> {
  await requireAdmin();

  if (typeof slug !== 'string' || !slug) return { error: 'Missing album.' };

  const admin = createAdminClient();
  const { data: album, error: albumError } = await admin
    .from('gallery_albums')
    .select('bucket_path')
    .eq('slug', slug)
    .maybeSingle();
  if (albumError || !album?.bucket_path) {
    return { error: 'This album is not configured for photo uploads yet.' };
  }

  if (!Array.isArray(files) || files.length === 0) {
    return { error: 'Select at least one photo to upload.' };
  }
  if (files.length > MAX_ALBUM_PHOTOS_PER_UPLOAD) {
    return { error: `Upload at most ${MAX_ALBUM_PHOTOS_PER_UPLOAD} photos at a time.` };
  }
  for (const file of files) {
    if (
      typeof file.size !== 'number' ||
      file.size <= 0 ||
      file.size > 8_000_000 ||
      !IMAGE_UPLOAD_MIMES.includes(file.type as ProfileImageMime)
    ) {
      return { error: 'Photos must be JPEG, PNG, or WebP files no larger than 8 MB.' };
    }
  }

  const supabase = await createClient();
  const tickets: PhotoUploadTicket[] = [];
  for (const file of files) {
    const path = `${album.bucket_path}/${crypto.randomUUID()}.${extensionForImageMime(file.type as ProfileImageMime)}`;
    const { data, error } = await supabase.storage.from('media').createSignedUploadUrl(path);
    if (error || !data) return { error: 'Could not prepare the upload. Please try again.' };
    tickets.push({ name: file.name, path: data.path, token: data.token });
  }

  return { tickets };
}

export async function finalizeAlbumPhotoUpload(slug: string): Promise<void> {
  await requireAdmin();
  revalidatePath(`/gallery/${slug}`);
}

export async function deleteJobPosting(id: string): Promise<{ error?: string }> {
  const viewer = await requireViewer();
  if (typeof id !== 'string' || !id) return { error: 'Missing job posting.' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_postings')
    .delete()
    .eq('id', id)
    .eq('posted_by_user_id', viewer.user.id)
    .select('id')
    .maybeSingle();
  if (error || !data) return { error: 'You can only delete job postings you shared.' };

  revalidatePath('/jobs');
  return {};
}

const albumSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: optionalText(2000),
  eventDate: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ),
});

function slugifyAlbumTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createGalleryAlbum(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = albumSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return formError('Enter a title (and optionally a description and date) and try again.');

  const slug = slugifyAlbumTitle(parsed.data.title);
  if (!slug) return formError('Enter a title that includes at least one letter or number.');

  const admin = createAdminClient();
  const { error } = await admin.from('gallery_albums').insert({
    slug,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    event_date: parsed.data.eventDate ?? null,
    bucket_path: slug,
    status: 'published',
  });
  if (error) {
    return formError(
      error.code === '23505'
        ? 'An album with that title (or a very similar one) already exists.'
        : 'The album could not be created. Please try again.',
    );
  }

  revalidatePath('/gallery');
  redirect(`/gallery/${slug}`);
}

export async function updateGalleryAlbumTitle(slug: string, title: string): Promise<{ error?: string }> {
  await requireAdmin();
  const parsed = z.string().trim().min(2).max(160).safeParse(title);
  if (!parsed.success) return { error: 'Enter a title between 2 and 160 characters.' };

  const admin = createAdminClient();
  const { error } = await admin
    .from('gallery_albums')
    .update({ title: parsed.data })
    .eq('slug', slug);
  if (error) return { error: 'The album could not be updated. Please try again.' };

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${slug}`);
  return {};
}

export async function deleteAlbumPhoto(slug: string, path: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (typeof path !== 'string' || !path) return { error: 'Missing photo.' };

  const admin = createAdminClient();
  const { data: album, error: albumError } = await admin
    .from('gallery_albums')
    .select('bucket_path')
    .eq('slug', slug)
    .maybeSingle();
  if (albumError || !album?.bucket_path) return { error: 'Album not found.' };
  if (path !== album.bucket_path && !path.startsWith(`${album.bucket_path}/`)) {
    return { error: 'That photo does not belong to this album.' };
  }

  const { error } = await admin.storage.from('media').remove([path]);
  if (error) return { error: 'The photo could not be deleted. Please try again.' };

  revalidatePath(`/gallery/${slug}`);
  return {};
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
  const candidateRows = rows.map((row) => ({
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

  if (candidateRows.length === 0) {
    return formError('The import does not contain any scholar records.');
  }

  const parsedRows: Partial<ScholarRow>[] = [];
  for (let index = 0; index < candidateRows.length; index += 1) {
    const candidate = candidateRows[index];
    const parsed = scholarImportSchema.safeParse(candidate);
    if (!parsed.success) return formError(`Scholar row ${index + 2} contains invalid or oversized fields.`);
    parsedRows.push(parsed.data);
  }

  const emails = parsedRows.map((row) => row.email as string);
  if (new Set(emails).size !== emails.length) {
    return formError('The import contains duplicate email addresses.');
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
