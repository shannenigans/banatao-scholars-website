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
  postedAt: string;
  description?: string;
  /** Optional expiry; expired roles are hidden when served from Supabase. */
  expiresAt?: string;
};

export const JOB_TYPES: JobType[] = ['Full-time', 'Internship', 'Part-time', 'Contract'];

export const STATIC_JOBS: JobPosting[] = [
  {
    id: 'swe-intern-2026',
    title: 'Software Engineering Intern',
    company: 'Bay Area Tech Co.',
    location: 'San Francisco, CA',
    type: 'Internship',
    remote: false,
    url: 'https://chat.whatsapp.com/D94syzs9UogIQ65GiYGqI2',
    postedBy: 'Alumni Network',
    postedAt: '2026-05-01',
    description:
      'Summer internship for current students interested in full-stack development. Shared by a Banatao alum — reach out on WhatsApp for a referral.',
  },
  {
    id: 'hardware-eng-newgrad',
    title: 'Hardware Engineer, New Grad',
    company: 'Semiconductor Startup',
    location: 'Santa Clara, CA',
    type: 'Full-time',
    remote: false,
    url: 'https://chat.whatsapp.com/D94syzs9UogIQ65GiYGqI2',
    postedBy: 'Alumni Network',
    postedAt: '2026-04-18',
    description:
      'New-grad role on a chip design team — a fitting nod to Dado’s roots. Mentorship available from alumni already on the team.',
  },
  {
    id: 'data-analyst-remote',
    title: 'Data Analyst',
    company: 'Climate Nonprofit',
    location: 'Remote (US)',
    type: 'Full-time',
    remote: true,
    url: 'https://chat.whatsapp.com/D94syzs9UogIQ65GiYGqI2',
    postedBy: 'Alumni Network',
    postedAt: '2026-04-02',
    description:
      'Remote analytics role with a mission-driven org. Great for scholars in environmental or physical sciences.',
  },
];
