import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Users,
  Cpu,
  Heart,
} from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { AtomGraphic } from '@/app/components/ui/atom-logo';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { StatGrid, Stat } from '@/app/components/marketing/stat-counter';
import { ScholarCard } from '@/app/components/marketing/scholar-card';
import { AnimateIn } from '@/app/components/marketing/animate-in';
import { fetchPublicScholars } from '@/app/lib/data';
import type { PublicScholar } from '@/app/types/scholar';
import { FOUNDER, SCHOLARSHIP } from '@/app/constants/legacy';

export default async function LandingPage() {
  const { data: visible } = await fetchPublicScholars();
  const featured = visible.filter((s) => s.bio || s.company).slice(0, 3);

  const scholarCount = visible.length;
  const stats: Stat[] = [
    { value: scholarCount > 0 ? String(scholarCount) : 'Since 2002', label: 'Scholar community' },
    { value: `${new Date().getFullYear() - SCHOLARSHIP.establishedYear}+`, label: 'Years of impact' },
    { value: SCHOLARSHIP.awardMax, label: 'Awarded over four years' },
    { value: '≥50%', label: 'Filipino heritage eligibility' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        {/* Decorative atoms */}
        <AtomGraphic className="pointer-events-none absolute -right-16 -top-10 h-80 w-80 opacity-20 sm:h-[28rem] sm:w-[28rem]" />
        <AtomGraphic className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 opacity-10" />
        {/* Floating dots */}
        <span className="animate-float pointer-events-none absolute left-[12%] top-24 h-2 w-2 rounded-full bg-gold/70" />
        <span className="animate-float pointer-events-none absolute right-[22%] bottom-24 h-1.5 w-1.5 rounded-full bg-white/50 [animation-delay:1.5s]" />
        <span className="animate-float pointer-events-none absolute left-[30%] bottom-16 h-1 w-1 rounded-full bg-gold/60 [animation-delay:3s]" />

        <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center duration-1000 animate-in fade-in slide-in-from-bottom-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-gold backdrop-blur">
              <Heart className="h-3.5 w-3.5" /> Honoring the legacy of Dado Banatao
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Empowering future tech leaders, the Filipino way
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              The Banatao Family Filipino American Education Fund sends Filipino American
              students into science and engineering — and this is the community that
              carries that mission forward.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-gold text-brand-navy-deep transition-transform hover:scale-[1.03] hover:bg-brand-gold-soft">
                <Link href="/scholars">
                  Meet the scholars <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/legacy">Dado&apos;s story</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* curved divider */}
        <div className="h-10 bg-background [clip-path:ellipse(75%_100%_at_50%_100%)]" />
      </section>

      {/* Stats */}
      <section className="container mx-auto -mt-6 px-4 sm:px-6 lg:px-8">
        <AnimateIn from="up">
          <StatGrid stats={stats} variant="dark" className="shadow-2xl" />
        </AnimateIn>
      </section>

      {/* Mission pillars */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <AnimateIn>
          <SectionHeading
            eyebrow="Our mission"
            title="Education that transforms lives"
            description={SCHOLARSHIP.mission}
          />
        </AnimateIn>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: 'Education',
              body: 'Renewable awards of $5,000 a year — up to $20,000 over four years — help Filipino American students excel in STEM at four-year universities.',
            },
            {
              icon: Lightbulb,
              title: 'Innovation',
              body: 'We champion the curiosity and grit that took Dado from a rice farm to the heart of Silicon Valley.',
            },
            {
              icon: Users,
              title: 'Community',
              body: 'A lifelong network of scholars and alumni who mentor, hire, and lift one another up.',
            },
          ].map((pillar, i) => (
            <AnimateIn key={pillar.title} delay={i * 120}>
              <div className="group h-full rounded-2xl border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-gold transition-transform duration-300 group-hover:scale-110">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-muted-foreground">{pillar.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Founder spotlight */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto grid items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <AnimateIn from="left">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">
              The visionary behind it all
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Dado Banatao
            </h2>
            <p className="mt-2 text-muted-foreground">{FOUNDER.lifespan}</p>
            <p className="mt-6 text-lg text-muted-foreground">{FOUNDER.summary}</p>
            <Button asChild className="mt-8">
              <Link href="/legacy">
                Explore his legacy <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </AnimateIn>
          <AnimateIn from="right" delay={120}>
            <div className="mb-6 flex justify-center">
              <Image
                src="/dado-headshot.webp"
                alt="Dado Banatao"
                width={160}
                height={160}
                className="h-40 w-40 rounded-full border-4 border-card object-cover shadow-lg ring-1 ring-border"
              />
            </div>
            <div className="relative overflow-hidden rounded-2xl border bg-card p-8">
              <AtomGraphic variant="navy" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-[0.07]" />
              <div className="relative flex items-center gap-3">
                <Cpu className="h-6 w-6 text-brand-navy" />
                <h3 className="font-display text-lg font-semibold">Chips in every PC</h3>
              </div>
              <ul className="relative mt-5 space-y-3 text-sm text-muted-foreground">
                <li>• First 10-Mbit Ethernet CMOS chip</li>
                <li>• First PC/XT- &amp; PC/AT-compatible chipset</li>
                <li>• One of the first PC graphics accelerators</li>
                <li>• Founded Chips &amp; Technologies and S3 Graphics</li>
                <li>• Founder of Tallwood Venture Capital</li>
              </ul>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Featured scholars */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <AnimateIn>
            <SectionHeading
              eyebrow="The community"
              title="Scholars carrying the torch"
              description="From semiconductors to startups, our scholars are building the future."
            />
          </AnimateIn>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((scholar, i) => (
              <AnimateIn key={scholar.id} delay={i * 120}>
                <ScholarCard scholar={scholar as PublicScholar} />
              </AnimateIn>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/scholars">
                View the full directory <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <AtomGraphic className="pointer-events-none absolute -bottom-20 right-[-3rem] h-64 w-64 opacity-15" />
        <div className="container relative mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
          <AnimateIn from="none">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Are you a Banatao Scholar?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Sign in to reach the community chat, the resource library, and your fellow
              scholars and alumni.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-gold text-brand-navy-deep transition-transform hover:scale-[1.03] hover:bg-brand-gold-soft">
                <Link href="/login">Sign in to the portal</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/apply">About the scholarship</Link>
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
