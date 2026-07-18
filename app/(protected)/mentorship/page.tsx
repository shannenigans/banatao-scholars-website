'use client';

import React from 'react';
import { Handshake, Users, Sparkles } from 'lucide-react';

import { MENTORSHIP_INTRO } from '@/app/constants/mentorship';
import { MentorshipForm } from '@/app/components/forms/mentorship-form';

const HOW_IT_WORKS = [
  {
    icon: Users,
    title: 'Sign up',
    body: 'Tell us whether you’d like to be a mentor or a mentee and the areas you care about.',
  },
  {
    icon: Handshake,
    title: 'Get matched',
    body: 'We pair you with someone across the network whose experience fits your goals.',
  },
  {
    icon: Sparkles,
    title: 'Grow together',
    body: 'Meet on your own cadence for advice, referrals, and encouragement.',
  },
];

export default function MentorshipPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-brand-gradient p-8 text-white sm:p-10">
        <p className="text-sm font-medium text-gold">Community</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {MENTORSHIP_INTRO.title}
        </h1>
        <p className="mt-3 max-w-2xl text-white/80">{MENTORSHIP_INTRO.body}</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {HOW_IT_WORKS.map((step) => (
          <div key={step.title} className="rounded-2xl border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-gold">
              <step.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-semibold">{step.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MentorshipForm />
        </div>
        <aside className="lg:col-span-2">
          <div className="rounded-2xl border bg-muted/40 p-6">
            <h3 className="font-display text-lg font-semibold">Why mentorship matters</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              For many scholars, the most meaningful chapter starts after graduation. Mentorship
              is how the Banatao Scholars network pays it forward — exactly what Dado and Maria
              hoped to build. Whether you’re looking for guidance or ready to give it, there’s a
              place for you here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
