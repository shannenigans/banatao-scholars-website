/**
 * Verified biographical content celebrating Dado Banatao and the scholarship.
 * Kept as data so the marketing/legacy pages stay easy to edit.
 *
 * Sources: the Banatao family obituary (banatao.com), the Asian Pacific Fund
 * scholarship page, CITRIS and the Banatao Institute, and the Asian Institute
 * of Management's Dado Banatao Incubator page.
 */

export const FOUNDER = {
  fullName: 'Diosdado "Dado" P. Banatao',
  born: 'May 23, 1946',
  birthplace: 'Iguig, Cagayan, Philippines',
  died: 'December 25, 2025',
  lifespan: '1946 – 2025',
  age: 79,
  summary:
    'The son of a rice farmer, Dado Banatao rose from a small town in the Philippines to become an influential Silicon Valley engineer and investor. With his wife Maria, he established a scholarship supporting California students of Filipino heritage.',
};

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export const TIMELINE: TimelineEntry[] = [
  {
    year: '1946',
    title: 'Born in Iguig, Cagayan',
    description:
      'Born May 23 to Salvador, a rice farmer, and Rosita, a housekeeper. As a boy he walked barefoot along a dirt road to reach Malabac Elementary School.',
  },
  {
    year: '1960s',
    title: 'BSEE, cum laude — Mapúa Institute of Technology',
    description:
      'After secondary studies at the Jesuit-run Ateneo de Tuguegarao, he earned a degree in Electrical Engineering with honors before emigrating to the United States.',
  },
  {
    year: '1972',
    title: 'MSEE, Stanford University',
    description:
      'Completed a master’s in Electrical Engineering & Computer Science at Stanford while building his career as a design engineer.',
  },
  {
    year: '1980s',
    title: 'The chips that powered the PC',
    description:
      'Developed the first 10-Mbit Ethernet CMOS chip, the first system-logic chipset compatible with the IBM PC/XT and PC/AT, and one of the first graphics accelerators for personal computers.',
  },
  {
    year: '1985',
    title: 'Co-founds Chips & Technologies',
    description:
      'His chipset company helped bring PC-compatible system logic to a growing personal-computer market and was later acquired by Intel.',
  },
  {
    year: '1989',
    title: 'Founds S3 Graphics',
    description:
      'Pioneered the graphics accelerator that brought rich visuals to the desktop PC.',
  },
  {
    year: '2000',
    title: 'Founds Tallwood Venture Capital',
    description:
      'Launched a venture firm focused on semiconductor and systems startups.',
  },
  {
    year: '2002',
    title: 'Establishes the scholarship',
    description:
      'With his wife Maria, founds the Banatao Family Filipino American Education Fund at the Asian Pacific Fund to send Filipino American students into STEM.',
  },
  {
    year: 'Legacy',
    title: 'A lifetime of giving back',
    description:
      'Co-founded the Philippine Development Foundation (PhilDev), lent his name to the CITRIS Banatao Institute across the University of California, and seeded the AIM–Dado Banatao Incubator — devoting his later years to education, mentorship, and Filipino innovation.',
  },
  {
    year: 'Dec 25, 2025',
    title: 'In loving memory',
    description:
      'Dado passed away at 79. His legacy continues through his family, his engineering work, and the educational programs he supported.',
  },
];

export const ACHIEVEMENTS: string[] = [
  'First 10-Mbit Ethernet CMOS chip',
  'First PC/XT- and PC/AT-compatible system-logic chipset',
  'One of the first GUI / graphics accelerators for the PC',
  'Three-time startup founder: Mostron, Chips & Technologies, S3 Graphics',
  'Founder of Tallwood Venture Capital',
  'Namesake of the CITRIS Banatao Institute across the University of California',
  'Co-founder of PhilDev and backer of the AIM–Dado Banatao Incubator',
];

/**
 * Facts about the scholarship itself, surfaced on the landing and apply pages.
 * Verified against the Asian Pacific Fund: $5,000 per year, renewable for up to
 * four years (up to $20,000 total).
 */
export const SCHOLARSHIP = {
  establishedYear: 2002,
  awardAnnual: '$5,000',
  awardMax: '$20,000',
  awardDetail: 'renewable for up to four years (up to $20,000 total)',
  administeredBy: 'the Asian Pacific Fund',
  heritage: 'at least 50% Filipino heritage',
  minGpa: '3.0',
  fields:
    'engineering, mathematics, computer science, environmental science, or a physical science',
  mission:
    'Supporting California students of Filipino heritage who excel in math and science as they pursue rewarding STEM careers — fields where Filipino Americans remain underrepresented.',
};
