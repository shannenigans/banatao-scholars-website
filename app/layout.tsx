'use client';
import { Toaster } from '@/app/components/ui/toaster';
import './styles/globals.css';
import UserProvider from './hooks/use-user';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <script src="https://accounts.google.com/gsi/client" async></script>
      <head>
      </head>
      <UserProvider>
        <body><Toaster />
          {children}</body></UserProvider>
    </html>
  );
}
