/**
 * Alumni-shared job & internship board for the scholar-only /jobs page.
 * If a Supabase `job_postings` table is present, fetchJobs() prefers it
 * (and filters out expired roles); otherwise these static samples render.
 *
 * `postedAt` / `expiresAt` are ISO dates (YYYY-MM-DD).
 */

export type JobType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';

export type JobPosting = {
  id: string | number;
  title: string;
  company: string;
  location?: string;
  type: JobType;
  remote?: boolean;
  /** Application or details link. */
  url: string;
  /** Name of the scholar/alum who shared the role. */
  postedBy?: string;
  /** auth.users id of the poster; used to gate the delete option to its owner. */
  postedByUserId?: string;
  postedAt: string;
  description?: string;
  /** Optional expiry; expired roles are hidden when served from Supabase. */
  expiresAt?: string;
};

export const JOB_TYPES: JobType[] = ['Full-time', 'Internship', 'Part-time', 'Contract'];

// The job board must contain real, authenticated alumni submissions only.
export const STATIC_JOBS: JobPosting[] = [];
