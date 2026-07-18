import React from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

const LOGO_SRC = {
  gold: '/banataoscholars-logo-gold.png',
  navy: '/banataoscholars-logo-navy.png',
} as const;

type LogoVariant = keyof typeof LOGO_SRC;

/**
 * Banatao Scholars mark — the Philippine sunburst with an atom at its core.
 * Sizing is controlled by `className` (e.g. `h-6 w-6`); `variant` picks the
 * gold or navy artwork. Used as the site logo.
 */
export function AtomLogo({
  className,
  variant = 'gold',
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="Banatao Scholars"
      width={480}
      height={480}
      className={cn('object-contain', className)}
      priority
    />
  );
}

/**
 * Larger decorative mark with a slow spin, for hero/section backgrounds.
 * Defaults to the gold artwork; pass `variant="navy"` for light backgrounds.
 */
export function AtomGraphic({
  className,
  variant = 'gold',
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt=""
      aria-hidden="true"
      width={480}
      height={480}
      className={cn('animate-atom-spin object-contain [transform-origin:center]', className)}
    />
  );
}
