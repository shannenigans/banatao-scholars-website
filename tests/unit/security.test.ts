import { describe, expect, it } from 'vitest';

import { mapJob, mapPublicScholar } from '@/app/lib/mappers';
import { isProtectedPath } from '@/app/lib/protected-routes';
import { resolveSiteUrl, safeNextPath } from '@/app/lib/site-url';
import type { JobPostingRow, PublicScholarRow } from '@/app/types/database';

describe('route protection', () => {
  it.each(['/portal', '/jobs/123', '/stories/alumni-story', '/admin'])('protects %s', (path) => {
    expect(isProtectedPath(path)).toBe(true);
  });

  it.each(['/', '/scholars', '/storytelling', '/login'])('leaves %s public', (path) => {
    expect(isProtectedPath(path)).toBe(false);
  });
});

describe('redirect URL safety', () => {
  it('never falls back to localhost in production', () => {
    expect(() => resolveSiteUrl({ NODE_ENV: 'production' })).toThrow(/must be configured/);
  });

  it('normalizes configured and Vercel origins', () => {
    expect(resolveSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://example.org/' }))
      .toBe('https://example.org');
    expect(resolveSiteUrl({ NODE_ENV: 'production', VERCEL_URL: 'preview.example.org' }))
      .toBe('https://preview.example.org');
  });

  it('rejects open redirects', () => {
    expect(safeNextPath('//evil.example')).toBe('/portal');
    expect(safeNextPath('/\\evil.example')).toBe('/portal');
    expect(safeNextPath('https://evil.example')).toBe('/portal');
    expect(safeNextPath('/settings')).toBe('/settings');
  });

  it('rejects a configured URL with a path', () => {
    expect(() => resolveSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://example.org/app' }))
      .toThrow(/origin only/);
  });
});

describe('database mappers', () => {
  it('drops private fields from a public scholar row', () => {
    const row: PublicScholarRow & { email: string; homeAddress: string } = {
      id: 1, status: 'Active', year: '2027', first: 'A', middle: null, last: 'Scholar',
      school: 'UC', major: 'Engineering', currentCity: 'Berkeley', currentState: 'CA',
      description: null, company: null, imageUrl: null, bio: null,
      email: 'private@example.org', homeAddress: 'private',
    };
    expect(mapPublicScholar(row)).not.toHaveProperty('email');
    expect(mapPublicScholar(row)).not.toHaveProperty('homeAddress');
  });

  it('maps snake_case job columns to the UI model', () => {
    const row: JobPostingRow = {
      id: '1', title: 'Engineer', company: 'Example', location: null,
      type: 'Full-time', remote: true, url: 'https://example.org/job',
      posted_by: 'Scholar', posted_by_user_id: 'user-1',
      posted_at: '2026-07-15T12:00:00Z', description: null, expires_at: '2026-08-01',
    };
    expect(mapJob(row)).toMatchObject({ postedBy: 'Scholar', postedAt: '2026-07-15', expiresAt: '2026-08-01' });
  });
});
