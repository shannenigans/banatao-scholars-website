import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchNewsBySlug, fetchPublicScholarById } from '@/app/lib/data';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ScholarCard } from '@/app/components/marketing/scholar-card';
import { DeleteStoryButton } from './delete-story-button';
import type { PublicScholar } from '@/app/types/scholar';

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const post = await fetchNewsBySlug(params.slug);
  if (!post) return { title: 'Post not found' };
  return { title: post.title, description: post.excerpt };
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function NewsDetailPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const post = await fetchNewsBySlug(params.slug);
  if (!post) notFound();
  const viewer = await getOptionalViewer();

  let scholar: PublicScholar | null = null;
  if (post.scholarId) {
    scholar = await fetchPublicScholarById(post.scholarId);
  }

  const paragraphs = (post.body ?? post.excerpt).split(/\n\s*\n/).map((p) => p.trim());
  const isSpotlight = post.category === 'spotlight';

  return (
    <div>
      {/* Header band */}
      <section className="bg-brand-gradient text-white">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All news
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <Badge className="bg-gold text-brand-navy-deep hover:bg-gold">
                {isSpotlight ? 'Spotlight' : 'News'}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Calendar className="h-4 w-4" /> {formatDate(post.date)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.author && <p className="mt-3 text-white/70">By {post.author}</p>}
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {post.coverImage && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl border">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {scholar && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl font-semibold">Featured scholar</h2>
            <ScholarCard scholar={scholar} />
          </div>
        )}

        <div className="mt-12 flex flex-col items-start gap-3 border-t pt-8 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/news">
              <ArrowLeft className="h-4 w-4" /> Back to news
            </Link>
          </Button>
          <Button asChild>
            <Link href="/scholars">
              Meet the scholars <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {viewer?.isAdmin && <DeleteStoryButton slug={post.slug} />}
        </div>
      </article>
    </div>
  );
}
