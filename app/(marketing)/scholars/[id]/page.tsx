import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Briefcase, MapPin, GraduationCap, Mail, Phone, Lock } from 'lucide-react';

import { getOptionalViewer } from '@/app/lib/auth';
import { fetchPublicScholarById, fetchScholarContact } from '@/app/lib/data';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

export async function generateMetadata(
  props: {
    params: Promise<{ id: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const scholar = await fetchPublicScholarById(Number(params.id));
  if (!scholar) return { title: 'Scholar not found' };
  return {
    title: `${scholar.first} ${scholar.last}`,
    description:
      scholar.bio ??
      `${scholar.first} ${scholar.last} — Banatao Scholar${
        scholar.year ? `, Class of ${scholar.year}` : ''
      }.`,
  };
}

export default async function ScholarProfilePage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const scholarId = Number(params.id);
  const scholar = await fetchPublicScholarById(scholarId);
  if (!scholar) notFound();
  const viewer = await getOptionalViewer();
  const contact = await fetchScholarContact(scholarId, viewer);

  const fullName = `${scholar.first} ${scholar.last}`;
  const location = [scholar.currentCity, scholar.currentState].filter(Boolean).join(', ');

  return (
    <div>
      {/* Header band */}
      <section className="bg-brand-gradient text-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/scholars"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All scholars
          </Link>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <Image
              src={
                scholar.imageUrl
                  ? `${scholar.imageUrl}?t=${new Date().getTime()}`
                  : '/unknown_avatar.svg'
              }
              alt={`${fullName}'s portrait`}
              width={128}
              height={128}
              className="h-32 w-32 rounded-full border-4 border-white/20 object-cover"
            />
            <div className="text-center sm:text-left">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {fullName}
              </h1>
              {scholar.company && (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-white/80 sm:justify-start">
                  <Briefcase className="h-4 w-4" />
                  {scholar.description ? `${scholar.description} @ ` : ''}
                  {scholar.company}
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {scholar.year && (
                  <Badge className="bg-gold text-brand-navy-deep hover:bg-gold">
                    Class of {scholar.year}
                  </Badge>
                )}
                {scholar.status && (
                  <Badge variant="outline" className="border-white/30 text-white">
                    {scholar.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">About</h2>
          <p className="mt-3 whitespace-pre-line text-muted-foreground">
            {scholar.bio || 'This scholar hasn’t added a bio yet.'}
          </p>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-semibold">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {(scholar.major || scholar.school) && (
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {scholar.major}
                    {scholar.major && scholar.school ? ' · ' : ''}
                    {scholar.school}
                  </span>
                </div>
              )}
              {location && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{location}</span>
                </div>
              )}
            </dl>
          </div>

          {/* Contacts — only for logged-in scholars */}
          {viewer ? (
            (contact?.email || contact?.cellPhone) && (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold">Contact</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2.5 hover:underline"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="break-all">{contact.email}</span>
                    </a>
                  )}
                  {contact.cellPhone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{contact.cellPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="rounded-2xl border bg-muted/40 p-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" /> Contact details are private
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in as a Banatao Scholar to view contact information.
              </p>
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
