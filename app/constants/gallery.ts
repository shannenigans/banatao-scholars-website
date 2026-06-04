/**
 * Photo albums for the scholar-only /gallery section.
 * Each album maps to a folder in the Supabase `media` storage bucket via
 * `bucketPath`. If a Supabase `gallery_albums` table is present, fetchAlbums()
 * prefers it; otherwise these static albums render. Photos for an album are
 * loaded from storage at view time (getMediaFromBucket), with `photos` as a
 * static fallback.
 *
 * `date` is an ISO date (YYYY-MM-DD).
 */

export type GalleryPhoto = {
  /** Absolute URL or local /public path. */
  src: string;
  alt?: string;
  caption?: string;
};

export type GalleryAlbum = {
  slug: string;
  title: string;
  date?: string;
  description?: string;
  /** Optional cover image; when absent, a brand gradient cover is shown. */
  coverImage?: string;
  /** Folder name within the `media` storage bucket. */
  bucketPath?: string;
  /** Static fallback photos when storage isn't configured. */
  photos?: GalleryPhoto[];
};

export const STATIC_ALBUMS: GalleryAlbum[] = [
  {
    slug: 'retreat-2024',
    title: 'Annual Scholars Retreat 2024',
    date: '2024-08-16',
    description:
      'Workshops, mentorship circles, and community from our flagship weekend in the Bay Area.',
    bucketPath: 'retreat_2024',
  },
  {
    slug: 'fall-welcome-mixer',
    title: 'Fall Welcome Mixer',
    date: '2025-09-12',
    description: 'Welcoming the newest cohort of Banatao Scholars at UC Berkeley.',
    bucketPath: 'fall_welcome_2025',
  },
  {
    slug: 'alumni-in-tech-panel',
    title: 'Alumni in Tech Panel',
    date: '2025-10-03',
    description:
      'Scholars now working across semiconductors, software, and startups share their journeys.',
    bucketPath: 'alumni_panel_2025',
  },
];
