import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Sparkles, Newspaper } from 'lucide-react';

import { NewsPost } from '@/app/constants/news';
import { Badge } from '@/app/components/ui/badge';

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Presentational card for a news post or scholar spotlight. */
export function NewsCard({ post }: { post: NewsPost }) {
  const isSpotlight = post.category === 'spotlight';
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {post.coverImage ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="relative flex h-44 w-full items-center justify-center bg-brand-gradient">
          {isSpotlight ? (
            <Sparkles className="h-10 w-10 text-gold" />
          ) : (
            <Newspaper className="h-10 w-10 text-gold" />
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <Badge variant={isSpotlight ? 'default' : 'secondary'}>
            {isSpotlight ? 'Spotlight' : 'News'}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy">
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
