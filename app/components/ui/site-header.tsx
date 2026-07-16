'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { cn } from '@/app/lib/utils';
import { useUser } from '@/app/hooks/use-user';
import { PUBLIC_NAV, SITE } from '@/app/constants/site';
import { Button } from '@/app/components/ui/button';
import { AtomLogo } from '@/app/components/ui/atom-logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/app/components/ui/sheet';

/** Public marketing header used across ungated pages. */
export function SiteHeader() {
  const pathname = usePathname();
  const { viewer } = useUser();
  const isAuthed = Boolean(viewer);
  const [open, setOpen] = React.useState(false);

  const navItems = isAuthed
    ? [...PUBLIC_NAV, { title: 'Resources', url: '/resources' }]
    : PUBLIC_NAV;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy transition-transform duration-300 group-hover:rotate-[18deg]">
            <AtomLogo className="h-6 w-6" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {SITE.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.url || pathname.startsWith(`${item.url}/`);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  active && 'text-foreground',
                )}
              >
                {item.title}
              </Link>
            );
          })}
          {isAuthed ? (
            <Button asChild size="sm" className="ml-2">
              <Link href="/portal">My Portal</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display">{SITE.name}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link href={isAuthed ? '/portal' : '/login'} onClick={() => setOpen(false)}>
                    {isAuthed ? 'My Portal' : 'Sign in'}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
