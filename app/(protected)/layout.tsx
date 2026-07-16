import { AppSidebar } from '@/app/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import { Footer } from '@/app/components/ui/footer';
import UserProvider from '@/app/hooks/use-user';
import { requireViewer } from '@/app/lib/auth';
import { fetchOwnProfile } from '@/app/lib/data';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireViewer();
  const profile = await fetchOwnProfile(viewer);

  return (
    <UserProvider viewer={viewer} scholarProfile={profile}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className="flex w-full flex-col justify-between">
          <main className="h-full w-full">
            <SidebarTrigger />
            {children}
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
