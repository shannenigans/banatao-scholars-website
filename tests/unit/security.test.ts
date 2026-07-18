import { describe, expect, it } from 'vitest';

import { mapJob, mapPublicScholar } from '@/app/lib/mappers';
import { isProtectedPath } from '@/app/lib/protected-routes';
import { resolveSiteUrl, safeNextPath } from '@/app/lib/site-url';
import { hasValidImageSignature, profilePicturePathFromPublicUrl } from '@/app/lib/uploads';
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
    expect(safeNextPath('/%2f%2fevil.example')).toBe('/portal');
    expect(safeNextPath('/%5cevil.example')).toBe('/portal');
    expect(safeNextPath('/settings')).toBe('/settings');
  });

  it('rejects a configured URL with a path', () => {
    expect(() => resolveSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://example.org/app' }))
      .toThrow(/origin only/);
  });
});

describe('profile image safety', () => {
  it('checks file signatures instead of trusting browser MIME metadata', () => {
    expect(hasValidImageSignature(new Uint8Array([0xff, 0xd8, 0xff, 0x00]), 'image/jpeg')).toBe(true);
    expect(hasValidImageSignature(new Uint8Array([0x3c, 0x73, 0x63, 0x72]), 'image/jpeg')).toBe(false);
    expect(
      hasValidImageSignature(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        'image/png',
      ),
    ).toBe(true);
    expect(
      hasValidImageSignature(
        new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]),
        'image/webp',
      ),
    ).toBe(true);
  });

  it('only recognizes the current user storage path on the configured origin', () => {
    const base = 'https://project.supabase.co';
    const ownUrl = `${base}/storage/v1/object/public/profile_pictures/user-1/photo.jpg`;
    expect(profilePicturePathFromPublicUrl(ownUrl, base, 'user-1')).toBe('user-1/photo.jpg');
    expect(profilePicturePathFromPublicUrl(ownUrl, base, 'user-2')).toBeNull();
    expect(
      profilePicturePathFromPublicUrl(
        'https://evil.example/storage/v1/object/public/profile_pictures/user-1/photo.jpg',
        base,
        'user-1',
      ),
    ).toBeNull();
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

  it('rejects impossible database values instead of leaking them into UI unions', () => {
    expect(() => mapJob({
      id: '1', title: 'Engineer', company: 'Example', location: null,
      type: 'Temporary', remote: false, url: 'https://example.org/job',
      posted_by: null, posted_by_user_id: 'user-1', posted_at: '2026-07-15T12:00:00Z',
      description: null, expires_at: null,
    })).toThrow(/unsupported job type/);
    expect(() => mapPublicScholar({
      id: null, status: 'Active', year: '2027', first: 'A', middle: null, last: 'Scholar',
      school: 'UC', major: null, currentCity: null, currentState: null,
      description: null, company: null, imageUrl: null, bio: null,
    })).toThrow(/null scholar id/);
  });
});
