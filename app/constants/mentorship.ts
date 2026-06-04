/**
 * Static copy and options for the scholar-only /mentorship page.
 * The sign-up form posts to submitMentorshipSignup(); when Supabase isn't
 * configured the form degrades gracefully and points scholars to WhatsApp.
 */

export const MENTORSHIP_INTRO = {
  title: 'Mentorship program',
  body:
    'Get paired with an alum working in your field — or volunteer to guide a scholar coming up behind you. Mentors and mentees connect for advice, referrals, and support across the whole Banatao Scholars network.',
};

/** Areas a mentor/mentee can select. */
export const MENTORSHIP_AREAS: string[] = [
  'Semiconductors & hardware',
  'Software & web',
  'Data & machine learning',
  'Environmental & physical sciences',
  'Startups & entrepreneurship',
  'Graduate school & research',
  'Internship & job search',
  'Resume & interview prep',
];

export type MentorshipRole = 'mentor' | 'mentee';
