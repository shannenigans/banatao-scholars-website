'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts. */
  delay?: number;
  /** Direction the element eases in from. */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  as?: keyof React.JSX.IntrinsicElements;
};

const HIDDEN: Record<NonNullable<AnimateInProps['from']>, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  none: 'scale-95',
};

/**
 * Reveals its children with a fade + slide once scrolled into view.
 * Respects prefers-reduced-motion (renders immediately, no transform).
 */
export function AnimateIn({
  children,
  className,
  delay = 0,
  from = 'up',
  as = 'div',
}: AnimateInProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const Tag = as as React.ElementType;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none',
        visible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : cn('opacity-0', HIDDEN[from]),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
