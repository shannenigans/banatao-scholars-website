import React from 'react';
import type { Metadata } from 'next';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchNews } from '@/app/lib/data';
import { SectionHeading } from '@/app/components/marketing/section-heading';
import { NewsList } from '@/app/components/marketing/news-list';
import { ShareStoryCta } from './share-story-cta';

export const metadata: Metadata = {
  title: 'News & Spotlights',
  description:
    'Announcements, stories, and scholar spotlights from the Banatao Scholars community.',
};

export default async function NewsPage() {
  const viewer = await getOptionalViewer();
  const { data: posts, unavailable } = await fetchNews();

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="From the community"
        title="News & Spotlights"
        description="Announcements, stories, and celebrations from across the Banatao Scholars network."
      />
      {viewer && <ShareStoryCta />}
      <NewsList posts={posts} unavailable={unavailable} isAdmin={Boolean(viewer?.isAdmin)} />
    </div>
  );
}
