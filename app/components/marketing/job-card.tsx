import React from 'react';
import { Briefcase, MapPin, ExternalLink, Globe } from 'lucide-react';

import { JobPosting } from '@/app/constants/jobs';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Presentational card for an alumni-shared job/internship posting. */
export function JobCard({ job }: { job: JobPosting }) {
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
      <Button asChild size="sm" className="shrink-0">
        <a href={job.url} target="_blank" rel="noopener noreferrer">
          View <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  );
}
