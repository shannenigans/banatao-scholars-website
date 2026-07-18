import React from 'react';
import { cn } from '@/app/lib/utils';

export type Stat = {
  value: string;
  label: string;
};

/** Row of headline statistics. Use on dark (navy) or light backgrounds. */
export function StatGrid({
  stats,
  variant = 'light',
  className,
}: {
  stats: Stat[];
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4',
        variant === 'dark' ? 'border-white/10 bg-white/10' : 'border-border bg-border',
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'p-6 text-center',
            variant === 'dark' ? 'bg-brand-navy-deep text-white' : 'bg-background',
          )}
        >
          <div className="font-display text-3xl font-bold sm:text-4xl">
            <span className={variant === 'dark' ? 'text-gold' : 'text-brand-navy'}>
              {stat.value}
            </span>
          </div>
          <div
            className={cn(
              'mt-2 text-sm',
              variant === 'dark' ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
