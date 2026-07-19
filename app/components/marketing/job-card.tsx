'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, ExternalLink, Globe, Trash2 } from 'lucide-react';

import { JobPosting } from '@/app/constants/jobs';
import { deleteJobPosting } from '@/app/lib/actions';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Card for an alumni-shared job/internship posting; owner can delete their own. */
export function JobCard({ job, currentUserId }: { job: JobPosting; currentUserId?: string }) {
  const router = useRouter();
  const canDelete = Boolean(currentUserId) && job.postedByUserId === currentUserId;
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteJobPosting(String(job.id));
      if (result.error) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-gold">
          <Briefcase className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{job.title}</h3>
            <Badge variant="secondary">{job.type}</Badge>
            {job.remote && (
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" /> Remote
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{job.company}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
            )}
            <span>Posted {formatDate(job.postedAt)}</span>
            {job.postedBy && <span>· by {job.postedBy}</span>}
          </p>
          {job.description && (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{job.description}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button asChild size="sm">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
        {canDelete && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label="Delete job posting"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {canDelete && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setError(null);
          }}
          title="Delete this job posting?"
          description="This permanently removes the posting from the board. This can't be undone."
          confirmLabel="Delete"
          pending={pending}
          error={error}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
