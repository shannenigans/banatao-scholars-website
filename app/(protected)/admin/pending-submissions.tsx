'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Pencil, CalendarClock, Sparkles } from 'lucide-react';

import {
  approveEvent,
  rejectEvent,
  approveStory,
  rejectStory,
  type EventApprovalInput,
  type StoryApprovalInput,
} from '@/app/lib/actions';
import type { PendingEvent, PendingStory } from '@/app/lib/data';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';

function RejectControl({
  pending,
  title,
  onReject,
}: {
  pending: boolean;
  title: string;
  onReject: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={() => setConfirmOpen(true)} disabled={pending}>
        <X className="h-3.5 w-3.5" /> Reject
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={title}
        description="This permanently deletes the submission. This can't be undone."
        confirmLabel="Reject"
        pending={pending}
        onConfirm={() => {
          onReject();
          setConfirmOpen(false);
        }}
      />
    </>
  );
}

function PendingEventRow({ event }: { event: PendingEvent }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [fields, setFields] = React.useState<EventApprovalInput>({
    title: event.title,
    startsOn: event.startsOn,
    endsOn: event.endsOn,
    location: event.location,
    description: event.description,
    url: event.url,
    memberOnly: event.memberOnly,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [approving, startApproving] = React.useTransition();
  const [rejecting, startRejecting] = React.useTransition();

  const handleCancel = () => {
    setFields({
      title: event.title,
      startsOn: event.startsOn,
      endsOn: event.endsOn,
      location: event.location,
      description: event.description,
      url: event.url,
      memberOnly: event.memberOnly,
    });
    setError(null);
    setEditing(false);
  };

  const handleApprove = () => {
    setError(null);
    startApproving(async () => {
      const result = await approveEvent(event.id, fields);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleReject = () => {
    startRejecting(async () => {
      const result = await rejectEvent(event.id);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  };

  return (
    <div className="rounded-xl border p-4">
      {editing ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor={`event-title-${event.id}`}>Title</Label>
            <Input
              id={`event-title-${event.id}`}
              value={fields.title}
              onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`event-starts-${event.id}`}>Start date</Label>
            <Input
              id={`event-starts-${event.id}`}
              type="date"
              value={fields.startsOn}
              onChange={(e) => setFields((f) => ({ ...f, startsOn: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`event-ends-${event.id}`}>End date</Label>
            <Input
              id={`event-ends-${event.id}`}
              type="date"
              value={fields.endsOn ?? ''}
              onChange={(e) => setFields((f) => ({ ...f, endsOn: e.target.value || undefined }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`event-location-${event.id}`}>Location</Label>
            <Input
              id={`event-location-${event.id}`}
              value={fields.location ?? ''}
              onChange={(e) => setFields((f) => ({ ...f, location: e.target.value || undefined }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`event-url-${event.id}`}>Details / RSVP link</Label>
            <Input
              id={`event-url-${event.id}`}
              type="url"
              value={fields.url ?? ''}
              onChange={(e) => setFields((f) => ({ ...f, url: e.target.value || undefined }))}
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor={`event-description-${event.id}`}>Description</Label>
            <Textarea
              id={`event-description-${event.id}`}
              rows={3}
              value={fields.description ?? ''}
              onChange={(e) => setFields((f) => ({ ...f, description: e.target.value || undefined }))}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id={`event-memberOnly-${event.id}`}
              type="checkbox"
              checked={fields.memberOnly}
              onChange={(e) => setFields((f) => ({ ...f, memberOnly: e.target.checked }))}
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor={`event-memberOnly-${event.id}`} className="font-normal">
              Scholars only
            </Label>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-medium">{event.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[event.startsOn, event.location].filter(Boolean).join(' · ')}
          </p>
          {event.description && <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>}
          {event.submittedBy && (
            <p className="mt-1 text-xs text-muted-foreground">Submitted by {event.submittedBy}</p>
          )}
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={handleApprove} disabled={approving || rejecting}>
          <Check className="h-3.5 w-3.5" /> {approving ? 'Approving…' : editing ? 'Save & approve' : 'Approve'}
        </Button>
        {editing ? (
          <Button type="button" size="sm" variant="outline" onClick={handleCancel} disabled={approving}>
            Cancel
          </Button>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
        <RejectControl pending={rejecting} title="Reject this event?" onReject={handleReject} />
      </div>
    </div>
  );
}

function PendingStoryRow({ story }: { story: PendingStory }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [fields, setFields] = React.useState<StoryApprovalInput>({
    title: story.title,
    excerpt: story.excerpt,
    body: story.body,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [approving, startApproving] = React.useTransition();
  const [rejecting, startRejecting] = React.useTransition();

  const handleCancel = () => {
    setFields({ title: story.title, excerpt: story.excerpt, body: story.body });
    setError(null);
    setEditing(false);
  };

  const handleApprove = () => {
    setError(null);
    startApproving(async () => {
      const result = await approveStory(story.slug, fields);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleReject = () => {
    startRejecting(async () => {
      const result = await rejectStory(story.slug);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  };

  return (
    <div className="rounded-xl border p-4">
      {editing ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`story-title-${story.slug}`}>Title</Label>
            <Input
              id={`story-title-${story.slug}`}
              value={fields.title}
              onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`story-excerpt-${story.slug}`}>Short summary</Label>
            <Textarea
              id={`story-excerpt-${story.slug}`}
              rows={2}
              value={fields.excerpt}
              onChange={(e) => setFields((f) => ({ ...f, excerpt: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`story-body-${story.slug}`}>Full story</Label>
            <Textarea
              id={`story-body-${story.slug}`}
              rows={6}
              value={fields.body ?? ''}
              onChange={(e) => setFields((f) => ({ ...f, body: e.target.value || undefined }))}
              className="mt-1"
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="font-medium">{story.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{story.excerpt}</p>
          {story.body && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium text-brand-navy">Read full story</summary>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{story.body}</p>
            </details>
          )}
          {story.submittedBy && (
            <p className="mt-1 text-xs text-muted-foreground">Submitted by {story.submittedBy}</p>
          )}
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={handleApprove} disabled={approving || rejecting}>
          <Check className="h-3.5 w-3.5" /> {approving ? 'Approving…' : editing ? 'Save & approve' : 'Approve'}
        </Button>
        {editing ? (
          <Button type="button" size="sm" variant="outline" onClick={handleCancel} disabled={approving}>
            Cancel
          </Button>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
        <RejectControl pending={rejecting} title="Reject this story?" onReject={handleReject} />
      </div>
    </div>
  );
}

export function PendingSubmissions({
  events,
  stories,
}: {
  events: PendingEvent[];
  stories: PendingStory[];
}) {
  if (events.length === 0 && stories.length === 0) {
    return <p className="text-sm text-muted-foreground">No pending submissions right now.</p>;
  }

  return (
    <div className="space-y-8">
      {events.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <CalendarClock className="h-4 w-4" /> Pending events ({events.length})
          </h3>
          <div className="mt-3 space-y-3">
            {events.map((event) => (
              <PendingEventRow key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {stories.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4" /> Pending stories ({stories.length})
          </h3>
          <div className="mt-3 space-y-3">
            {stories.map((story) => (
              <PendingStoryRow key={story.slug} story={story} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
