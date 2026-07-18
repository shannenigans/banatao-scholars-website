import { describe, expect, it } from 'vitest';

import { STATIC_EVENTS } from '@/app/constants/events';
import { STATIC_JOBS } from '@/app/constants/jobs';
import { STATIC_NEWS } from '@/app/constants/news';
import { STATIC_ALBUMS } from '@/app/constants/gallery';
import { SCHOLARSHIP } from '@/app/constants/legacy';

describe('published fallback content', () => {
  it('does not publish sample opportunities or unconfirmed event dates', () => {
    expect(STATIC_JOBS).toEqual([]);
    expect(STATIC_EVENTS).toEqual([]);
  });

  it('does not publish invented announcements, opportunities, or albums', () => {
    expect(STATIC_NEWS).toEqual([]);
    expect(STATIC_ALBUMS).toEqual([]);
  });

  it('matches current eligible fields', () => {
    expect(SCHOLARSHIP.fields).toContain('environmental science');
    expect(SCHOLARSHIP.fields).not.toContain('biological science');
  });
});
