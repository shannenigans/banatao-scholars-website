'use client';
import { Toaster } from '@/app/components/ui/toaster';
import './styles/globals.css';

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
      <body><Toaster />
        {children}</body>
    </html>
  );
}
