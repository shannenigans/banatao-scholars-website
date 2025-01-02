'use client';
import './styles/globals.css';

let title = 'Next.js + Postgres Auth Starter';
let description =
  'This is a Next.js starter kit that uses NextAuth.js for simple email + password login and a Postgres database to persist the data.';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <script src="https://accounts.google.com/gsi/client" async></script>
      <head>
      {/* <link href="./output.css" rel="stylesheet" /> */}
      </head>
      <body>{children}</body> 
    </html>
  );
}
