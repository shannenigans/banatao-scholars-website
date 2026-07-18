import type { ScholarEvent } from '@/app/constants/events';
import type { GalleryAlbum } from '@/app/constants/gallery';
import { JOB_TYPES, type JobPosting, type JobType } from '@/app/constants/jobs';
import type { NewsPost } from '@/app/constants/news';
import { SCHOLAR_STATUS } from '@/app/lib/utils';
import type {
  EventRow,
  GalleryAlbumRow,
  JobPostingRow,
  NewsRow,
  PrivateScholarRow,
  PublicScholarRow,
} from '@/app/types/database';
import type { PrivateScholarProfile, PublicScholar } from '@/app/types/scholar';

function optional(value: string | null): string | undefined {
  return value ?? undefined;
}

function requiredNumber(value: number | null, field: string): number {
  if (value === null) throw new Error(`Database view returned a null ${field}`);
  return value;
}

function newsCategory(value: string): NewsPost['category'] {
  if (value === 'news' || value === 'spotlight') return value;
  throw new Error('Database returned an unsupported news category');
}

function jobType(value: string): JobType {
  if ((JOB_TYPES as string[]).includes(value)) return value as JobType;
  throw new Error('Database returned an unsupported job type');
}

export function mapPublicScholar(row: PublicScholarRow): PublicScholar {
  return {
    id: requiredNumber(row.id, 'scholar id'),
    status: row.status as SCHOLAR_STATUS,
    year: row.year ?? '',
    first: row.first ?? '',
    middle: optional(row.middle),
    last: row.last ?? '',
    school: row.school ?? '',
    major: optional(row.major),
    currentCity: optional(row.currentCity),
    currentState: optional(row.currentState),
    description: row.description ?? '',
    company: optional(row.company),
    imageUrl: optional(row.imageUrl),
    bio: optional(row.bio),
  };
}

export function mapPrivateScholar(row: PrivateScholarRow): PrivateScholarProfile {
  return { ...mapPublicScholar(row), email: optional(row.email), cellPhone: optional(row.cellPhone) };
}

export function mapEvent(row: EventRow): ScholarEvent {
  return {
    id: row.id, title: row.title, date: row.starts_on, endDate: optional(row.ends_on),
    location: optional(row.location), description: optional(row.description),
    url: optional(row.url), memberOnly: row.member_only,
  };
}

export function mapNews(row: NewsRow): NewsPost {
  return {
    slug: row.slug, title: row.title, excerpt: row.excerpt, body: optional(row.body),
    date: row.published_at?.slice(0, 10) ?? '', author: optional(row.author),
    coverImage: optional(row.cover_image), category: newsCategory(row.category),
    scholarId: row.scholar_id ?? undefined, featured: row.featured,
  };
}

export function mapJob(row: JobPostingRow): JobPosting {
  return {
    id: row.id, title: row.title, company: row.company, location: optional(row.location),
    type: jobType(row.type), remote: row.remote, url: row.url, postedBy: optional(row.posted_by),
    postedAt: row.posted_at.slice(0, 10), description: optional(row.description),
    expiresAt: row.expires_at?.slice(0, 10),
  };
}

export function mapAlbum(row: GalleryAlbumRow): GalleryAlbum {
  return {
    slug: row.slug, title: row.title, date: optional(row.event_date),
    description: optional(row.description), coverImage: optional(row.cover_image),
    bucketPath: optional(row.bucket_path),
  };
}
