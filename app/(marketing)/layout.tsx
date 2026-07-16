import React from 'react';
import { SiteHeader } from '@/app/components/ui/site-header';
import { SiteFooter } from '@/app/components/ui/site-footer';
import UserProvider from '@/app/hooks/use-user';
import { getOptionalViewer } from '@/app/lib/auth';

/** Shared shell for public marketing + directory pages. */
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getOptionalViewer();
  return (
    <UserProvider viewer={viewer}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
      </div>
    </UserProvider>
  );
}
