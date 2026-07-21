import 'server-only';

import { cache } from 'react';

import { createClient } from '@/app/utils/supabase/server';
import type {
  PrivateScholarProfile,
  PublicScholar,
  ScholarContact,
  ScholarDirectoryEntry,
} from '@/app/types/scholar';
import { SCHOLAR_STATUS } from '@/app/lib/utils';
import { STATIC_EVENTS, type ScholarEvent } from '@/app/constants/events';
import { STATIC_NEWS, type NewsPost } from '@/app/constants/news';
import { STATIC_JOBS, type JobPosting } from '@/app/constants/jobs';
import { STATIC_ALBUMS, type GalleryAlbum, type GalleryPhoto } from '@/app/constants/gallery';
import type { AuthenticatedViewer } from '@/app/lib/auth';
import { mapAlbum, mapEvent, mapJob, mapNews, mapPrivateScholar, mapPublicScholar } from '@/app/lib/mappers';

export type DataResult<T> = { data: T; unavailable: boolean };

const PUBLIC_SCHOLAR_COLUMNS =
  'id,status,year,first,middle,last,school,major,currentCity,currentState,description,company,imageUrl,bio';
const PRIVATE_PROFILE_COLUMNS = `${PUBLIC_SCHOLAR_COLUMNS},email,cellPhone`;

const optional = (value: string | null) => value ?? undefined;

export async function fetchPublicScholars(): Promise<DataResult<PublicScholar[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('public_scholars')
      .select(PUBLIC_SCHOLAR_COLUMNS)
      .in('status', [SCHOLAR_STATUS.ACTIVE, SCHOLAR_STATUS.GRADUATED])
      .order('year', { ascending: false });
    if (error) throw error;
    return { data: (data ?? []).map(mapPublicScholar), unavailable: false };
  } catch {
    return { data: [], unavailable: true };
  }
}

export async function fetchScholarDirectory(
  viewer: AuthenticatedViewer | null,
): Promise<DataResult<ScholarDirectoryEntry[]>> {
  const publicResult = await fetchPublicScholars();
  if (!viewer || publicResult.data.length === 0) return publicResult;

  const ids = publicResult.data.map(({ id }) => id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scholar_contacts')
    .select('id,email,cellPhone')
    .in('id', ids);
  if (error) return { data: publicResult.data, unavailable: true };

  const contacts = new Map<number, ScholarContact>(
    (data ?? []).flatMap((row) => row.id === null ? [] : [[
      row.id,
      { email: optional(row.email), cellPhone: optional(row.cellPhone) },
    ] as const]),
  );
  return {
    data: publicResult.data.map((scholar) => ({ ...scholar, ...contacts.get(scholar.id) })),
    unavailable: publicResult.unavailable,
  };
}

export async function fetchPublicScholarById(id: number): Promise<PublicScholar | null> {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('public_scholars')
      .select(PUBLIC_SCHOLAR_COLUMNS)
      .eq('id', id)
      .in('status', [SCHOLAR_STATUS.ACTIVE, SCHOLAR_STATUS.GRADUATED])
      .maybeSingle();
    if (error || !data) return null;
    return mapPublicScholar(data);
  } catch {
    return null;
  }
}

export async function fetchScholarContact(
  id: number,
  viewer: AuthenticatedViewer | null,
): Promise<ScholarContact | null> {
  if (!viewer) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scholar_contacts')
    .select('email,cellPhone')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return { email: optional(data.email), cellPhone: optional(data.cellPhone) };
}

export const fetchOwnProfile = cache(async function fetchOwnProfile(
  viewer: AuthenticatedViewer,
): Promise<PrivateScholarProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scholars')
    .select(PRIVATE_PROFILE_COLUMNS)
    .eq('email', viewer.user.email)
    .maybeSingle();
  return error || !data ? null : mapPrivateScholar(data);
});

export async function fetchEvents(): Promise<DataResult<ScholarEvent[]>> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('id,title,starts_on,ends_on,location,description,url,member_only,status,published_at,submitted_by,submitted_by_user_id')
      .eq('status', 'published')
      .lte('published_at', now)
      .order('starts_on', { ascending: true });
    if (error) throw error;
    return { data: (data ?? []).map(mapEvent), unavailable: false };
  } catch {
    return { data: STATIC_EVENTS, unavailable: true };
  }
}

export type PendingEvent = {
  id: string;
  title: string;
  startsOn: string;
  endsOn?: string;
  location?: string;
  description?: string;
  url?: string;
  memberOnly: boolean;
  submittedBy?: string;
};

/** Scholar-submitted events awaiting admin approval (admin-only via RLS). */
export async function fetchPendingEvents(): Promise<PendingEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('id,title,starts_on,ends_on,location,description,url,member_only,submitted_by')
    .eq('status', 'draft')
    .not('submitted_by_user_id', 'is', null)
    .order('starts_on', { ascending: true });
  if (error) return [];
  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    startsOn: row.starts_on,
    endsOn: row.ends_on ?? undefined,
    location: row.location ?? undefined,
    description: row.description ?? undefined,
    url: row.url ?? undefined,
    memberOnly: row.member_only,
    submittedBy: row.submitted_by ?? undefined,
  }));
}

export type PendingStory = {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  submittedBy?: string;
};

/** Scholar-submitted spotlight stories awaiting admin approval (admin-only via RLS). */
export async function fetchPendingStories(): Promise<PendingStory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('slug,title,excerpt,body,submitted_by')
    .eq('status', 'draft')
    .not('submitted_by_user_id', 'is', null)
    .order('slug', { ascending: true });
  if (error) return [];
  return (data ?? []).map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body ?? undefined,
    submittedBy: row.submitted_by ?? undefined,
  }));
}

export async function fetchNews(): Promise<DataResult<NewsPost[]>> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('news')
      .select('slug,title,excerpt,body,published_at,author,cover_image,category,scholar_id,featured,status,submitted_by,submitted_by_user_id')
      .eq('status', 'published')
      .lte('published_at', now)
      .order('published_at', { ascending: false });
    if (error) throw error;
    return { data: (data ?? []).map(mapNews), unavailable: false };
  } catch {
    return { data: STATIC_NEWS, unavailable: true };
  }
}

export async function fetchNewsBySlug(slug: string): Promise<NewsPost | null> {
  const result = await fetchNews();
  return result.data.find((post) => post.slug === slug) ?? null;
}

export async function fetchJobs(): Promise<DataResult<JobPosting[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_postings')
      .select('id,title,company,location,type,remote,url,posted_by,posted_by_user_id,posted_at,description,expires_at')
      .order('posted_at', { ascending: false });
    if (error) throw error;
    const today = new Date().toISOString().slice(0, 10);
    return {
      data: (data ?? []).map(mapJob).filter((job) => !job.expiresAt || job.expiresAt >= today),
      unavailable: false,
    };
  } catch {
    return { data: STATIC_JOBS, unavailable: true };
  }
}

export async function fetchAlbums(): Promise<DataResult<GalleryAlbum[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('gallery_albums')
      .select('slug,title,event_date,description,cover_image,bucket_path,status')
      .eq('status', 'published')
      .order('event_date', { ascending: false });
    if (error) throw error;
    return { data: (data ?? []).map(mapAlbum), unavailable: false };
  } catch {
    return { data: STATIC_ALBUMS, unavailable: true };
  }
}

export async function fetchAlbumPhotos(album: GalleryAlbum): Promise<GalleryPhoto[]> {
  if (!album.bucketPath) return album.photos ?? [];
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from('media').list(album.bucketPath);
  if (error) return album.photos ?? [];
  const paths = (data ?? [])
    .filter(({ name }) => name && name !== '.emptyFolderPlaceholder')
    .map(({ name }) => `${album.bucketPath}/${name}`);
  if (paths.length === 0) return album.photos ?? [];
  const { data: signed, error: signedError } = await supabase.storage
    .from('media')
    .createSignedUrls(paths, 3600);
  if (signedError) return album.photos ?? [];
  return (signed ?? []).flatMap(({ signedUrl, path }) =>
    signedUrl ? [{ src: signedUrl, alt: album.title, path: path ?? undefined }] : [],
  );
}

export async function fetchAlbumCoverImage(album: GalleryAlbum): Promise<string | undefined> {
  if (album.coverImage) return album.coverImage;
  if (!album.bucketPath) return album.photos?.[0]?.src;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('media')
    .list(album.bucketPath, { limit: 1, sortBy: { column: 'created_at', order: 'asc' } });
  if (error) return album.photos?.[0]?.src;
  const first = (data ?? []).find(({ name }) => name && name !== '.emptyFolderPlaceholder');
  if (!first) return album.photos?.[0]?.src;

  const { data: signed, error: signedError } = await supabase.storage
    .from('media')
    .createSignedUrl(`${album.bucketPath}/${first.name}`, 3600);
  return signedError ? album.photos?.[0]?.src : signed?.signedUrl;
}
