'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Sparkles, Newspaper, Trash2 } from 'lucide-react';

import { NewsPost } from '@/app/constants/news';
import { rejectStory } from '@/app/lib/actions';
import { Badge } from '@/app/components/ui/badge';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Card for a news post or scholar spotlight; admins can delete it. */
export function NewsCard({ post, isAdmin = false }: { post: NewsPost; isAdmin?: boolean }) {
  const isSpotlight = post.category === 'spotlight';
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await rejectStory(post.slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/news/${post.slug}`} className="flex flex-1 flex-col">
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

      {isAdmin && (
        <button
          type="button"
          aria-label="Delete post"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      {isAdmin && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setError(null);
          }}
          title="Delete this post?"
          description="This permanently removes it from the site. This can't be undone."
          confirmLabel="Delete"
          pending={pending}
          error={error}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
