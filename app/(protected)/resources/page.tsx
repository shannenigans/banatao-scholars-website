'use client';

import React from 'react';
import {
  ExternalLink,
  FolderOpen,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Users,
  DollarSign,
  BookOpen,
  Calendar,
  type LucideIcon,
} from 'lucide-react';

import { RESOURCES, ResourceLink } from '@/app/constants/resources';

const iconMap: Record<ResourceLink['icon'], LucideIcon> = {
  drive: FolderOpen,
  whatsapp: MessageCircle,
  briefcase: Briefcase,
  graduation: GraduationCap,
  users: Users,
  dollar: DollarSign,
  book: BookOpen,
  calendar: Calendar,
};

export default function ResourcesPage() {
  const featured = RESOURCES.filter((r) => r.featured);
  const rest = RESOURCES.filter((r) => !r.featured);

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Scholar Resources</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Everything you need in one place — the shared Drive, the community chat, and curated
          guides from across the Banatao Scholars network.
        </p>
      </div>

      {/* Featured */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {featured.map((r) => {
          const Icon = iconMap[r.icon];
          return (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border bg-brand-navy p-6 text-white transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
                  {r.title}
                  <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
                </h2>
                <p className="mt-1 text-sm text-white/70">{r.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Categories */}
      <h2 className="mt-12 font-display text-xl font-semibold">Guides &amp; links</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((r) => {
          const Icon = iconMap[r.icon];
          return (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 flex items-center gap-1.5 font-semibold">
                {r.title}
                <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
