import React from 'react';
import type { Metadata } from 'next';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { SCHOLARSHIP } from '@/app/constants/legacy';
import { EXTERNAL_LINKS } from '@/app/constants/site';

export const metadata: Metadata = {
  title: 'The Scholarship',
  description:
    'About the Banatao Family Filipino American Education Fund — eligibility, awards, and how to apply through the Asian Pacific Fund.',
};

const ELIGIBILITY = [
  'At least 50% Filipino heritage',
  'California resident',
  'Incoming freshman who plans to enroll full-time at an accredited four-year college or university for the 2026–27 academic year',
  'Minimum GPA of 3.0',
  'Pursuing engineering, mathematics, computer science, environmental science, or a physical science',
];

export default function ApplyPage() {
  return (
    <>
      <section className="bg-brand-gradient text-white">
        <div className="container mx-auto px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            The Banatao Family Filipino American Education Fund
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            {SCHOLARSHIP.mission}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="The award" title="What you receive" />
            <div className="mt-6 space-y-4 text-lg text-muted-foreground">
              <p>
                Selected scholars receive{' '}
                <strong className="text-foreground">{SCHOLARSHIP.awardAnnual} per year</strong>,{' '}
                {SCHOLARSHIP.awardDetail} — plus membership in a lifelong community of scholars
                and alumni.
              </p>
              <p>
                Each year, {SCHOLARSHIP.finalists}. The fund was established in{' '}
                {SCHOLARSHIP.establishedYear} by Dado and Maria Banatao, and is administered by{' '}
                {SCHOLARSHIP.administeredBy} to support fields where Filipino Americans remain
                underrepresented.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-8">
            <h3 className="font-display text-xl font-semibold">Eligibility</h3>
            <ul className="mt-5 space-y-3">
              {ELIGIBILITY.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              The 2026 application cycle is closed. The Asian Pacific Fund says applications
              will reopen in 2027. Criteria may change, so always confirm them on the official page.
            </p>
            <Button asChild size="lg" className="mt-6 w-full">
              <a
                href={EXTERNAL_LINKS.asianPacificFund}
                target="_blank"
                rel="noopener noreferrer"
              >
                View the official scholarship page <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
