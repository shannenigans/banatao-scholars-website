import 'server-only';

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
    (data ?? []).map((row) => [
      row.id,
      { email: optional(row.email), cellPhone: optional(row.cellPhone) },
    ]),
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

export async function fetchOwnProfile(
  viewer: AuthenticatedViewer,
): Promise<PrivateScholarProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scholars')
    .select(PRIVATE_PROFILE_COLUMNS)
    .eq('email', viewer.user.email)
    .maybeSingle();
  return error || !data ? null : mapPrivateScholar(data);
}

export async function fetchEvents(): Promise<DataResult<ScholarEvent[]>> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('id,title,starts_on,ends_on,location,description,url,member_only,status,published_at')
      .eq('status', 'published')
      .lte('published_at', now)
      .order('starts_on', { ascending: true });
    if (error) throw error;
    return { data: (data ?? []).map(mapEvent), unavailable: false };
  } catch {
    return { data: STATIC_EVENTS, unavailable: true };
  }
}

export async function fetchNews(): Promise<DataResult<NewsPost[]>> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('news')
      .select('slug,title,excerpt,body,published_at,author,cover_image,category,scholar_id,featured,status')
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
  return (signed ?? []).flatMap(({ signedUrl }) =>
    signedUrl ? [{ src: signedUrl, alt: album.title }] : [],
  );
}
