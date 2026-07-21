'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Lock, ExternalLink, Trash2 } from 'lucide-react';

import { ScholarEvent } from '@/app/constants/events';
import { rejectEvent } from '@/app/lib/actions';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';

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

export function EventCard({ event, isAdmin = false }: { event: ScholarEvent; isAdmin?: boolean }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await rejectEvent(String(event.id));
      if (result.error) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      router.refresh();
    });
  };

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
          {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        {event.url && (
          <Button asChild variant="outline" size="sm">
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              Details <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        {isAdmin && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Delete event"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {isAdmin && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setError(null);
          }}
          title="Delete this event?"
          description="This permanently removes the event from the site. This can't be undone."
          confirmLabel="Delete"
          pending={pending}
          error={error}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
