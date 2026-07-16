const LOCAL_URL = 'http://localhost:3000';

export function resolveSiteUrl(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl = env.VERCEL_URL?.trim();
  const candidate = configured || (vercelUrl ? `https://${vercelUrl}` : undefined);

  if (!candidate) {
    if (env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_SITE_URL or VERCEL_URL must be configured in production.');
    }
    return LOCAL_URL;
  }

  const url = new URL(candidate);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('The configured site URL must be an HTTP(S) origin only.');
  }
  return url.origin;
}

export function safeNextPath(value: string | null, fallback = '/portal'): string {
  return value?.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
    ? value
    : fallback;
}
