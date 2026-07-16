/**
 * Photo albums for the scholar-only /gallery section.
 * Each album maps to a folder in the Supabase `media` storage bucket via
 * `bucketPath`. If a Supabase `gallery_albums` table is present, fetchAlbums()
 * prefers it; otherwise these static albums render. Photos for an album are
 * loaded from storage at view time, with `photos` as an optional reviewed
 * fallback.
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

// Album metadata and bucket paths must be reviewed before publication.
export const STATIC_ALBUMS: GalleryAlbum[] = [];
