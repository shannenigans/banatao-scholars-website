export const PROTECTED_PREFIXES = [
  '/portal',
  '/settings',
  '/gallery',
  '/admin',
  '/resources',
  '/mentorship',
  '/jobs',
  '/stories',
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
