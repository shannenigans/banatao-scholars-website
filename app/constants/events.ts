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

// Do not publish placeholder dates. Events appear only after a reviewed record is
// marked `published` in Supabase.
export const STATIC_EVENTS: ScholarEvent[] = [];
