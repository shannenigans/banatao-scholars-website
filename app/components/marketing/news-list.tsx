'use client';

import React from 'react';

import { NewsPost } from '@/app/constants/news';
import { NewsCard } from '@/app/components/marketing/news-card';
import { AnimateIn } from '@/app/components/marketing/animate-in';
import { cn } from '@/app/lib/utils';

type Filter = 'all' | 'news' | 'spotlight';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'news', label: 'News' },
  { key: 'spotlight', label: 'Spotlights' },
];

/** Client-side filterable grid of news posts and spotlights. */
export function NewsList({ posts }: { posts: NewsPost[] }) {
  const [filter, setFilter] = React.useState<Filter>('all');
  const visible = posts.filter((p) => filter === 'all' || p.category === filter);

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'border-brand-navy bg-brand-navy text-white'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post, i) => (
            <AnimateIn key={post.slug} delay={i * 80}>
              <NewsCard post={post} />
            </AnimateIn>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-xl border bg-muted/40 p-6 text-center text-muted-foreground">
          Nothing here yet — check back soon.
        </p>
      )}
    </>
  );
}
