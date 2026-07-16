import React from 'react';
import type { Metadata } from 'next';

import { fetchNews } from '@/app/lib/data';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { NewsList } from '@/app/components/marketing/news-list';

export const metadata: Metadata = {
  title: 'News & Spotlights',
  description:
    'Announcements, stories, and scholar spotlights from the Banatao Scholars community.',
};

export default async function NewsPage() {
  const { data: posts, unavailable } = await fetchNews();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="From the community"
        title="News & Spotlights"
        description="Announcements, stories, and celebrations from across the Banatao Scholars network."
      />
      <NewsList posts={posts} />
      {posts.length === 0 && (
        <p className="mx-auto mt-12 max-w-2xl rounded-xl border bg-muted/40 p-6 text-center text-muted-foreground">
          {unavailable ? 'News is temporarily unavailable.' : 'No published news yet.'}
        </p>
      )}
    </div>
  );
}
