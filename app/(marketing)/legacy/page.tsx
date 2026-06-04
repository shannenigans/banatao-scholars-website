import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Quote as QuoteIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { AtomGraphic } from '@/app/components/ui/atom-logo';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { Timeline } from '@/app/components/marketing/timeline';
import { AnimateIn } from '@/app/components/marketing/animate-in';
import {
  FOUNDER,
  TIMELINE,
  ACHIEVEMENTS,
  QUOTES,
} from '@/app/constants/legacy';

export const metadata: Metadata = {
  title: 'The Legacy of Dado Banatao',
  description:
    'From a rice farm in the Philippines to the heart of Silicon Valley — celebrating the life and generosity of Diosdado "Dado" Banatao.',
};

export default function LegacyPage() {
  return (
    <>
      {/* Hero / In Memoriam */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <AtomGraphic className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 opacity-15" />
        <div className="container relative mx-auto px-4 py-24 text-center sm:px-6 lg:px-8 duration-1000 animate-in fade-in slide-in-from-bottom-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            In Memoriam
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Diosdado “Dado” Banatao
          </h1>
          <p className="mt-4 text-xl text-white/80">{FOUNDER.lifespan}</p>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/80">{FOUNDER.summary}</p>
        </div>
      </section>

      {/* Bio */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="His story"
            title="From a rice farm to Silicon Valley"
          />
          <div className="mt-6 space-y-5 text-lg text-muted-foreground">
            <p>
              Born on {FOUNDER.born} in {FOUNDER.birthplace}, Dado Banatao was the son of
              Salvador, a rice farmer, and Rosita, a housekeeper. As a boy he walked barefoot
              along a dirt road to reach Malabbac Elementary School. Education was his way
              forward: after the Jesuit-run Ateneo de Tuguegarao, he earned his degree in
              Electrical Engineering, <em>cum laude</em>, from the Mapúa Institute of Technology,
              then emigrated to the United States and completed a master&apos;s in Electrical
              Engineering and Computer Science at Stanford in 1972.
            </p>
            <p>
              In Silicon Valley, Dado became one of the most consequential engineers of the
              personal-computer era. He developed the first 10-Mbit Ethernet CMOS chip, the
              first system-logic chipset compatible with the IBM PC/XT and PC/AT, and one of
              the first graphics accelerators for the PC. An early member of the legendary
              Homebrew Computer Club — alongside Steve Jobs and Steve Wozniak — and a three-time
              founder of Mostron, Chips &amp; Technologies, and S3 Graphics, he later launched
              Tallwood Venture Capital with roughly $300 million of his own money. His work
              touched nearly every computer on Earth.
            </p>
            <p>
              But Dado never forgot where he came from. With his wife Maria, he established the
              Banatao Family Filipino American Education Fund in 2002, co-founded the Philippine
              Development Foundation (PhilDev), lent his name to the CITRIS Banatao Institute
              across the University of California, and seeded the AIM–Dado Banatao Incubator —
              devoting his later years to opening doors for the next generation of Filipino
              innovators. He passed away on {FOUNDER.died}, at {FOUNDER.age}, surrounded by
              family.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="A career of firsts" title="What he built" />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {ACHIEVEMENTS.map((item, i) => (
              <AnimateIn key={item} delay={i * 80} from={i % 2 === 0 ? 'left' : 'right'}>
                <div className="flex h-full items-start gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <span className="font-medium">{item}</span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="A life in milestones" title="The journey" />
        <div className="mx-auto mt-12 max-w-2xl">
          <Timeline entries={TIMELINE} />
        </div>
      </section>

      {/* Quotes */}
      <section className="border-t bg-muted/40">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="In his words" title="On education" />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {QUOTES.map((q, i) => (
              <AnimateIn key={q.text} delay={i * 120}>
                <figure className="h-full rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <QuoteIcon className="h-8 w-8 text-gold" />
                  <blockquote className="mt-4 font-display text-lg italic">
                    “{q.text}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-muted-foreground">
                    — {q.attribution}
                  </figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          His legacy lives on through every scholar
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/scholars">
              Meet the scholars <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/apply">About the scholarship</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
