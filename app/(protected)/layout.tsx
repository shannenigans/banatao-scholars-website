'use client';
import { AppSidebar } from '@/app/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
