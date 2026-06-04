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
    body: `On December 25, 2025, our community lost its founder, Diosdado "Dado" Banatao, at the age of 79. From a rice farm in Iguig, Cagayan to the heart of Silicon Valley, Dado's life was a testament to what education can unlock.

His chips are in nearly every personal computer ever made. But to the Banatao Scholars, his greatest invention was opportunity itself. The scholarship he and his wife Maria founded in 2002 has carried generations of students into engineering, computer science, and the physical sciences.

"I know how education can transform lives," he often said, "because it transformed mine." We will carry that conviction forward.

To honor Dado, explore his story on our Legacy page, and — if you are a scholar — pay it forward by mentoring the next cohort coming up behind you.`,
    date: '2025-12-28',
    author: 'Banatao Scholars',
    category: 'news',
    featured: true,
  },
  {
    slug: 'welcome-2026-cohort',
    title: 'Welcome to the 2026 cohort of Banatao Scholars',
    excerpt:
      'Five new scholars join the family this year, pursuing degrees across engineering, computer science, and the physical sciences at universities throughout California.',
    body: `We are thrilled to welcome our newest Banatao Scholars. Each year, about five students of Filipino heritage are selected for a renewable award of $5,000 a year — up to $20,000 over four years — to pursue STEM degrees at four-year universities.

This year's cohort brings curiosity and grit to fields ranging from semiconductors to environmental science. Over the coming months you'll meet them through our scholar directory and spotlight series.

Welcome to the family. The whole network — scholars and alumni alike — is here to support you.`,
    date: '2026-09-15',
    author: 'Scholarship Committee',
    category: 'news',
    featured: true,
  },
  {
    slug: 'annual-retreat-2026-recap',
    title: 'Recap: the 2026 Annual Scholars Retreat',
    excerpt:
      'A weekend in the Bay Area brought scholars and alumni together for workshops, mentorship, and a whole lot of community.',
    body: `Our flagship retreat returned this summer, gathering scholars and alumni for three days of workshops, mentorship circles, and storytelling. Highlights included an alumni-in-tech panel, resume and interview clinics, and an evening honoring Dado's legacy.

Photos from the weekend are up in the gallery for signed-in scholars. Thank you to everyone who made the trip — and to the alumni who came back to give the next generation a hand up.`,
    date: '2026-08-19',
    author: 'Events Team',
    category: 'news',
  },
  {
    slug: 'spotlight-engineering-the-future',
    title: 'Scholar Spotlight: engineering the future',
    excerpt:
      'A Banatao Scholar reflects on the path from a first-generation college student to a career building the chips that power modern computing.',
    body: `"Being a Banatao Scholar meant I was never doing it alone," shares one of our alumni now working in semiconductors. "The award helped me focus on school, but the community is what helped me grow."

From late-night study sessions to mentorship from alumni already in industry, our scholars describe a network that extends far beyond graduation. Many return to mentor, hire, and champion the scholars coming up behind them.

Are you a scholar with a story to tell? Reach out — we'd love to feature you.`,
    date: '2026-05-10',
    author: 'Banatao Scholars',
    category: 'spotlight',
    featured: true,
  },
  {
    slug: 'spotlight-giving-back',
    title: 'Scholar Spotlight: giving back to the next generation',
    excerpt:
      'An alum on why mentorship is the truest way to honor the scholarship — and how the community keeps paying it forward.',
    body: `For many alumni, the most meaningful chapter starts after graduation. "Someone mentored me when I was figuring it all out," one alum told us. "Now I get to be that person for a new scholar."

Through the mentorship program and the alumni job board, scholars connect across cohorts — sharing referrals, advice, and encouragement. It's the quiet engine behind the Banatao Scholars network, and it embodies exactly what Dado and Maria hoped to build.`,
    date: '2026-03-22',
    author: 'Banatao Scholars',
    category: 'spotlight',
  },
];
