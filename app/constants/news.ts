/**
 * News, announcements, and scholar spotlights for the public /news section.
 * If a Supabase `news` table is present, fetchNews() prefers it; otherwise
 * these render so the section is always presentable.
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

export const STATIC_NEWS: NewsPost[] = [
  {
    slug: 'remembering-dado-banatao',
    title: 'Remembering Dado Banatao (1946–2025)',
    excerpt:
      'Our founder, mentor, and inspiration passed away on December 25, 2025. We celebrate a life that opened doors for hundreds of Filipino American students.',
    body: `On December 25, 2025, our community lost its founder, Diosdado "Dado" Banatao, at the age of 79. From Iguig, Cagayan to Silicon Valley, his life demonstrated the opportunity education can create.

Dado was a semiconductor engineer, entrepreneur, and investor whose work helped advance personal computing. The scholarship he and his wife Maria established in 2002 supports California students of Filipino heritage pursuing science and engineering degrees.

To honor Dado, explore the independently sourced milestones on our Legacy page. Scholars can also carry the fund's mission forward by supporting the next cohort.`,
    date: '2025-12-28',
    author: 'Banatao Scholars',
    category: 'news',
    featured: true,
  },
];
