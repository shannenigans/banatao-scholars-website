/**
 * Static fallback events for the /events calendar.
 * If a Supabase `events` table is present, fetchEvents() will prefer it;
 * otherwise these render so the page is always presentable.
 *
 * `date` is an ISO date (YYYY-MM-DD). Optional `endDate` for multi-day events.
 */

export type ScholarEvent = {
  id: string | number;
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  description?: string;
  /** Optional RSVP / details link. */
  url?: string;
  /** Member-only events are labeled; details may live in the gated resources hub. */
  memberOnly?: boolean;
};

export const STATIC_EVENTS: ScholarEvent[] = [
  {
    id: 'annual-retreat',
    title: 'Annual Scholars Retreat',
    date: '2026-08-15',
    endDate: '2026-08-17',
    location: 'Bay Area, CA',
    description:
      'Our flagship weekend bringing scholars and alumni together for workshops, mentorship, and community.',
    memberOnly: true,
  },
  {
    id: 'fall-welcome',
    title: 'Fall Welcome Mixer',
    date: '2026-09-12',
    location: 'UC Berkeley',
    description:
      'Kick off the academic year and welcome the newest cohort of Banatao Scholars.',
  },
  {
    id: 'tech-panel',
    title: 'Alumni in Tech Panel',
    date: '2026-10-03',
    location: 'Virtual',
    description:
      'Hear from scholars now working across semiconductors, software, and startups.',
  },
  {
    id: 'application-info',
    title: 'Scholarship Info Session',
    date: '2026-11-07',
    location: 'Virtual',
    description:
      'For prospective applicants: eligibility, the application timeline, and tips from current scholars.',
  },
];
