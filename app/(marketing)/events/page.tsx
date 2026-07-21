import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchEvents } from '@/app/lib/data';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { AnimateIn } from '@/app/components/marketing/animate-in';
import { Button } from '@/app/components/ui/button';
import { SubmitEventForm } from './submit-event-form';
import { EventCard } from './event-card';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming gatherings, panels, and retreats for the Banatao Scholars community.',
};

export default async function EventsPage() {
  const viewer = await getOptionalViewer();
  const { data: events, unavailable } = await fetchEvents();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((e) => new Date(`${e.endDate ?? e.date}T00:00:00`) >= now);
  const past = sorted
    .filter((e) => new Date(`${e.endDate ?? e.date}T00:00:00`) < now)
    .reverse();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Community calendar"
        title="Events"
        description="Retreats, mixers, and panels that keep our scholars and alumni connected."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="mb-4 font-display text-xl font-semibold">Upcoming</h2>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((e, i) => (
              <AnimateIn key={e.id} delay={i * 70}>
                <EventCard event={e} isAdmin={viewer?.isAdmin} />
              </AnimateIn>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border bg-muted/40 p-6 text-center text-muted-foreground">
            {unavailable
              ? 'Events are temporarily unavailable.'
              : 'No upcoming events right now — check back soon for new gatherings.'}
          </p>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mb-4 mt-12 font-display text-xl font-semibold">Past events</h2>
            <div className="space-y-4 opacity-75">
              {past.map((e) => (
                <EventCard key={e.id} event={e} isAdmin={viewer?.isAdmin} />
              ))}
            </div>
          </>
        )}

        {viewer ? (
          <SubmitEventForm />
        ) : (
          <div className="mt-12 rounded-2xl border bg-muted/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Are you a Banatao Scholar? Sign in for invites, reminders, and the community chat.
            </p>
            <Button asChild className="mt-4">
              <Link href="/login">
                Scholar sign in <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
