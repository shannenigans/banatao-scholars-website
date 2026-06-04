/**
 * Central site configuration.
 * External links, contact info, and navigation live here so they can be
 * updated in one place. Swap any placeholder URLs for the real ones as needed.
 */

export const SITE = {
  name: 'Banatao Scholars',
  tagline: 'Empowering the next generation of Filipino American innovators',
  description:
    'The community and alumni network of the Banatao Family Filipino American Education Fund — celebrating the legacy of Dado Banatao and the scholars carrying it forward.',
};

/** Public base URL. Prefer the env var in production; falls back to the request origin in middleware. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export const EXTERNAL_LINKS = {
  whatsapp: 'https://chat.whatsapp.com/D94syzs9UogIQ65GiYGqI2',
  googleDrive: 'https://drive.google.com/drive/folders/1S5fopPv0wFFyYGoe3d_YULrpccT7mFYJ',
  asianPacificFund: 'https://asianpacificfund.org/what-we-do/scholarships/',
  philDev: 'https://phildev.org/',
  contactEmail: 'mailto:sbarrameda17@gmail.com',
};

export type NavItem = { title: string; url: string };

/** Primary navigation shown in the public marketing header. */
export const PUBLIC_NAV: NavItem[] = [
  { title: 'Scholars', url: '/scholars' },
  { title: 'Legacy', url: '/legacy' },
  { title: 'News', url: '/news' },
  { title: 'Events', url: '/events' },
  { title: 'Scholarship', url: '/apply' },
];
