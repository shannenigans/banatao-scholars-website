import React from 'react';
import { cn } from '@/app/lib/utils';

/**
 * Atom mark — three orbits + nucleus, drawn in `currentColor` so it can be
 * tinted (e.g. `text-gold`). Used as the site logo.
 */
export function AtomLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="3.6" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <ellipse cx="24" cy="24" rx="19" ry="7.5" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)" />
      </g>
    </svg>
  );
}

/**
 * Larger decorative atom with slowly orbiting electrons, for hero/section
 * backgrounds. Drawn in `currentColor`.
 */
export function AtomGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={cn('text-gold', className)}
      aria-hidden="true"
    >
      <g className="animate-atom-spin" style={{ transformOrigin: 'center' }}>
        <g stroke="currentColor" strokeWidth="1.5" opacity="0.55">
          <ellipse cx="100" cy="100" rx="92" ry="34" />
          <ellipse cx="100" cy="100" rx="92" ry="34" transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="100" rx="92" ry="34" transform="rotate(120 100 100)" />
        </g>
        <circle cx="192" cy="100" r="5" fill="currentColor" />
        <circle cx="54" cy="180" r="5" fill="currentColor" transform="rotate(60 100 100)" />
        <circle cx="54" cy="20" r="5" fill="currentColor" transform="rotate(120 100 100)" />
      </g>
      <circle cx="100" cy="100" r="8" fill="currentColor" />
    </svg>
  );
}
