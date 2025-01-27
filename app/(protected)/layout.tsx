'use client';
import { AppSidebar } from '@/app/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='flex flex-col w-full justify-between'>
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
      <Footer />
      </div>
    </SidebarProvider>
  );
}
