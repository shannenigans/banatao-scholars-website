import React from 'react';
import { SiteHeader } from '@/app/components/ui/site-header';
import { SiteFooter } from '@/app/components/ui/site-footer';

/** Shared shell for public marketing + directory pages. */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </div>
  );
}
