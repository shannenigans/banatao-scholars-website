'use client';

import React from 'react';
import { Search, Briefcase } from 'lucide-react';

import { JobPosting, JOB_TYPES, JobType } from '@/app/constants/jobs';
import { JobCard } from '@/app/components/marketing/job-card';
import { JobPostingForm } from '@/app/components/forms/job-posting-form';
import { Input } from '@/app/components/ui/input';
import { useDebounce } from '@/app/hooks/use-debounce';
import { cn } from '@/app/lib/utils';

export function JobsBoard({ jobs, unavailable }: { jobs: JobPosting[]; unavailable: boolean }) {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<JobType | 'All'>('All');
  const debouncedSearch = useDebounce(search, 300);

  const q = debouncedSearch.toLowerCase();
  const visible = jobs.filter((j) => {
    const matchesType = typeFilter === 'All' || j.type === typeFilter;
    const matchesSearch =
      !q ||
      [j.title, j.company, j.location, j.description]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Job & Internship Board</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Roles shared by Banatao Scholars and alumni. Found something? Reach out in the
            community for a referral.
          </p>
        </div>
        <JobPostingForm />
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, companies, locations…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', ...JOB_TYPES] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                typeFilter === t
                  ? 'border-brand-navy bg-brand-navy text-white'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-8 space-y-4">
        {visible.length > 0 ? (
          visible.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-2xl border bg-muted/40 p-10 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              {unavailable
                ? 'The job board is temporarily unavailable.'
                : jobs.length === 0
                  ? 'No roles have been shared yet. Be the first to post one.'
                  : 'No roles match your search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
