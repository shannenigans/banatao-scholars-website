'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpenText,
  FolderOpen,
  Calendar,
  GalleryHorizontal,
  Settings,
  MessageCircle,
  ArrowRight,
  Handshake,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

import { useUser } from '@/app/hooks/use-user';
import { EXTERNAL_LINKS } from '@/app/constants/site';

type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const LINKS: QuickLink[] = [
  {
    title: 'Resources',
    description: 'Drive, guides, mentorship, and renewal info.',
    href: '/resources',
    icon: FolderOpen,
  },
  {
    title: 'Scholar Directory',
    description: 'Browse fellow scholars and alumni — with contacts.',
    href: '/scholars',
    icon: BookOpenText,
  },
  {
    title: 'Mentorship',
    description: 'Get paired with an alum — or mentor a scholar.',
    href: '/mentorship',
    icon: Handshake,
  },
  {
    title: 'Job Board',
    description: 'Internships and roles shared by the network.',
    href: '/jobs',
    icon: Briefcase,
  },
  {
    title: 'Events',
    description: 'Upcoming retreats, mixers, and panels.',
    href: '/events',
    icon: Calendar,
  },
  {
    title: 'Gallery',
    description: 'Photos from retreats and gatherings.',
    href: '/gallery',
    icon: GalleryHorizontal,
  },
  {
    title: 'Your Profile',
    description: 'Update your bio, photo, and contact details.',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'WhatsApp Community',
    description: 'Jump into the scholar group chat.',
    href: EXTERNAL_LINKS.whatsapp,
    icon: MessageCircle,
    external: true,
  },
];

export default function PortalPage() {
  const { supabaseResponseUser, scholarProfile } = useUser();
  const user = supabaseResponseUser?.user;
  const greetingName = scholarProfile?.first || user?.email?.split('@')[0] || 'Scholar';

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-brand-gradient p-8 text-white sm:p-10">
        <p className="text-sm font-medium text-gold">Welcome back</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Hello, {greetingName} 👋
        </h1>
        <p className="mt-3 max-w-xl text-white/80">
          This is your scholar portal — your hub for resources, community, and everything
          happening across the Banatao Scholars network.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => {
          const inner = (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-gold">
                <link.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 flex items-center gap-1.5 font-semibold">
                {link.title}
                <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60" />
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
            </>
          );
          const className =
            'group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md';
          return link.external ? (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link key={link.title} href={link.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
