import React from 'react';
import { TimelineEntry } from '@/app/constants/legacy';

/** Vertical timeline used on the legacy page. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative border-l-2 border-border pl-8">
      {entries.map((entry, i) => (
        <li key={`${entry.year}-${i}`} className="mb-10 last:mb-0">
          <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-gold ring-4 ring-background" />
          <p className="font-display text-sm font-bold uppercase tracking-wider text-gold">
            {entry.year}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
          <p className="mt-1 text-muted-foreground">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}
