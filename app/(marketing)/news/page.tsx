import React from 'react';
import type { Metadata } from 'next';

import { fetchNews } from '@/app/lib/actions';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { NewsList } from '@/app/components/marketing/news-list';

export const metadata: Metadata = {
  title: 'News & Spotlights',
  description:
    'Announcements, stories, and scholar spotlights from the Banatao Scholars community.',
};

export default async function NewsPage() {
  const posts = await fetchNews();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="From the community"
        title="News & Spotlights"
        description="Announcements, stories, and celebrations from across the Banatao Scholars network."
      />
      <NewsList posts={posts} />
    </div>
  );
}
