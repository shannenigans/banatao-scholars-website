/**
 * Verified biographical content celebrating Dado Banatao and the scholarship.
 * Kept as data so the marketing/legacy pages stay easy to edit.
 *
 * Sources: Wikipedia (Dado Banatao), Asian Pacific Fund (asianpacificfund.org),
 * Positively Filipino, Asian Journal.
 */

export const FOUNDER = {
  fullName: 'Diosdado "Dado" P. Banatao',
  born: 'May 23, 1946',
  birthplace: 'Iguig, Cagayan, Philippines',
  died: 'December 25, 2025',
  lifespan: '1946 – 2025',
  age: 79,
  summary:
    'The son of a rice farmer, Dado Banatao rose from a small town in the Philippines to become one of Silicon Valley’s most influential engineers and investors. His chips are in nearly every personal computer ever made — and his generosity opened the door to higher education for hundreds of Filipino American students.',
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
      'Born May 23 to Salvador, a rice farmer, and Rosita, a housekeeper. As a boy he walked barefoot along a dirt road to reach Malabbac Elementary School.',
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
      'Completed a master’s in Electrical Engineering & Computer Science at Stanford while working as a design engineer — and joined the Homebrew Computer Club, where he crossed paths with Steve Jobs and Steve Wozniak.',
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
      'His chipset company brought PC-compatible system logic to the masses and was later acquired by Intel for roughly $300 million.',
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
      'Launched his own venture firm with roughly $300 million of his own money to back the next wave of semiconductor and systems startups.',
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
      'Dado passed away at 79, surrounded by family, from complications of a neurological disorder. He is survived by his wife Maria, their children, and grandchildren — and by the hundreds of scholars he helped send into STEM.',
  },
];

export const ACHIEVEMENTS: string[] = [
  'First 10-Mbit Ethernet CMOS chip',
  'First PC/XT- and PC/AT-compatible system-logic chipset',
  'One of the first GUI / graphics accelerators for the PC',
  'Three-time startup founder: Mostron, Chips & Technologies, S3 Graphics',
  'Founder of Tallwood Venture Capital',
  'Member of the Homebrew Computer Club alongside Steve Jobs & Steve Wozniak',
  'Namesake of the CITRIS Banatao Institute across the University of California',
  'Co-founder of PhilDev and backer of the AIM–Dado Banatao Incubator',
];

export type Quote = { text: string; attribution: string };

export const QUOTES: Quote[] = [
  {
    text: 'I know how education can transform lives, because it transformed mine.',
    attribution: 'Dado Banatao',
  },
  {
    text: 'Having grown up in a rural area of the Philippines, my background has made me passionate about education.',
    attribution: 'Dado Banatao',
  },
  {
    text: 'Maria and I hope this will inspire students to dream big and to make the sacrifices needed to continue their education so they can fully contribute to society and make their dreams a reality.',
    attribution: 'Dado & Maria Banatao',
  },
];

/**
 * Facts about the scholarship itself, surfaced on the landing and apply pages.
 * Verified against the Asian Pacific Fund: $5,000 per year, renewable for up to
 * four years (up to $20,000 total), with about five scholars selected each year.
 */
export const SCHOLARSHIP = {
  establishedYear: 2002,
  awardAnnual: '$5,000',
  awardMax: '$20,000',
  awardDetail: 'renewable for up to four years (up to $20,000 total)',
  finalists: 'about 5 scholars are selected',
  scholarsPerYear: '~5 scholars / year',
  administeredBy: 'the Asian Pacific Fund',
  heritage: 'at least 50% Filipino heritage',
  minGpa: '3.0',
  fields:
    'engineering, mathematics, computer science, or a physical or biological science',
  mission:
    'Supporting California students of Filipino heritage who excel in math and science as they pursue rewarding STEM careers — fields where Filipino Americans remain underrepresented.',
};
