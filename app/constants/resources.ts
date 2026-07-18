/**
 * Curated resources surfaced on the scholar-only /resources hub.
 * Edit freely — these render as cards. `external` links open in a new tab.
 */
import { EXTERNAL_LINKS } from './site';

export type ResourceLink = {
  title: string;
  description: string;
  url: string;
  /** lucide-react icon name handled by the page; see iconMap there. */
  icon:
    | 'drive'
    | 'whatsapp'
    | 'briefcase'
    | 'graduation'
    | 'users'
    | 'dollar'
    | 'book'
    | 'calendar';
  /** Featured links render as large, prominent cards at the top. */
  featured?: boolean;
};

export const RESOURCES: ResourceLink[] = [
  {
    title: 'Scholar Google Drive',
    description:
      'Shared documents, templates, recordings, and the full resource library for Banatao Scholars.',
    url: EXTERNAL_LINKS.googleDrive,
    icon: 'drive',
    featured: true,
  },
  {
    title: 'WhatsApp Community',
    description:
      'Join the scholar group chat to connect with peers and alumni, ask questions, and stay in the loop.',
    url: EXTERNAL_LINKS.whatsapp,
    icon: 'whatsapp',
    featured: true,
  },
  {
    title: 'Career & Internships',
    description:
      'Resume templates, interview prep, and job/internship leads shared by the alumni network.',
    url: EXTERNAL_LINKS.googleDrive,
    icon: 'briefcase',
  },
  {
    title: 'Mentorship Program',
    description:
      'Get paired with an alum working in your field for guidance, referrals, and support.',
    url: EXTERNAL_LINKS.whatsapp,
    icon: 'users',
  },
  {
    title: 'Scholarship Renewal',
    description:
      'Requirements, deadlines, and reporting forms to keep your award active through graduation.',
    url: EXTERNAL_LINKS.asianPacificFund,
    icon: 'graduation',
  },
  {
    title: 'Financial Aid & FAFSA',
    description:
      'Guides for stacking financial aid, FAFSA tips, and managing your award disbursements.',
    url: EXTERNAL_LINKS.googleDrive,
    icon: 'dollar',
  },
];
