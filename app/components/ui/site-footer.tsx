import React from 'react';
import Link from 'next/link';
import { Mail, ExternalLink, ArrowRight } from 'lucide-react';

import { SITE, EXTERNAL_LINKS, PUBLIC_NAV } from '@/app/constants/site';
import { AtomLogo } from '@/app/components/ui/atom-logo';

/** Public marketing footer with community + scholarship links. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy">
              <AtomLogo className="h-6 w-6 text-gold" />
            </span>
            <span className="font-display text-lg font-semibold">{SITE.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {SITE.description}
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:underline dark:text-gold"
          >
            Scholar sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {PUBLIC_NAV.map((item) => (
              <li key={item.url}>
                <Link href={item.url} className="hover:text-foreground">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Connect</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={EXTERNAL_LINKS.asianPacificFund}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                Asian Pacific Fund <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href={EXTERNAL_LINKS.philDev}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                PhilDev <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href={EXTERNAL_LINKS.contactEmail}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail className="h-3 w-3" /> Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>
            In loving memory of Dado Banatao (1946–2025) — whose generosity made this
            community possible.
          </p>
          <p className="mt-1">
            © {year} {SITE.name}. Built by and for the scholars.
          </p>
        </div>
      </div>
    </footer>
  );
}
