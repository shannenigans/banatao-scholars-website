import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, MapPin, Lock, ExternalLink, ArrowRight } from 'lucide-react';

import { fetchEvents } from '@/app/lib/data';
import { ScholarEvent } from '@/app/constants/events';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { AnimateIn } from '@/app/components/marketing/animate-in';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming gatherings, panels, and retreats for the Banatao Scholars community.',
};

function formatDate(event: ScholarEvent) {
  const opts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const start = new Date(`${event.date}T00:00:00`);
  const startStr = start.toLocaleDateString('en-US', opts);
  if (event.endDate) {
    const end = new Date(`${event.endDate}T00:00:00`);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', opts)}`;
  }
  return startStr;
}

function EventCard({ event }: { event: ScholarEvent }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-navy text-white">
          <span className="text-xs uppercase">
            {new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="font-display text-lg font-bold leading-none">
            {new Date(`${event.date}T00:00:00`).getDate()}
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{event.title}</h3>
            {event.memberOnly && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" /> Scholars
              </Badge>
            )}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {formatDate(event)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {event.location}
              </span>
            )}
          </p>
          {event.description && (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{event.description}</p>
          )}
        </div>
      </div>
      {event.url && (
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <a href={event.url} target="_blank" rel="noopener noreferrer">
            Details <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      )}
    </div>
  );
}

export default async function EventsPage() {
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
                <EventCard event={e} />
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
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}

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
      </div>
    </div>
  );
}
