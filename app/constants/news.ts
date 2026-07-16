/**
 * News, announcements, and scholar spotlights for the public /news section.
 * If a Supabase `news` table is present, fetchNews() prefers it; otherwise
 * only reviewed, published records should appear.
 *
 * `date` is an ISO date (YYYY-MM-DD). `body` paragraphs are split on blank lines.
 */

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Full article body. Separate paragraphs with blank lines. */
  body?: string;
  date: string;
  author?: string;
  /** Optional cover image (local /public path or a whitelisted remote host). */
  coverImage?: string;
  category: 'news' | 'spotlight';
  /** For spotlights: optional link to the scholar's public profile. */
  scholarId?: number;
  featured?: boolean;
};

// Never invent institutional announcements or scholar quotes as fallback content.
export const STATIC_NEWS: NewsPost[] = [];
