import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, MapPin, Mail, Phone } from 'lucide-react';

import { Scholar } from '@/app/types/scholar';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

/**
 * Presentational scholar card. Contact details only render when
 * `showContacts` is true (i.e. the viewer is a logged-in scholar).
 */
export function ScholarCard({
  scholar,
  showContacts = false,
}: {
  scholar: Scholar;
  showContacts?: boolean;
}) {
  const fullName = `${scholar.first} ${scholar.last}`;
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <Link href={`/scholars/${scholar.id}`} className="flex-grow">
        <CardHeader className="flex-row items-center gap-4">
          <Image
            src={
              scholar.imageUrl
                ? `${scholar.imageUrl}?t=${new Date().getTime()}`
                : '/unknown_avatar.svg'
            }
            alt={`${fullName}'s portrait`}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{fullName}</h3>
            {scholar.company && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {scholar.description ? `${scholar.description} @ ` : ''}
                  {scholar.company}
                </span>
              </p>
            )}
            {scholar.currentCity && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {scholar.currentCity}
                  {scholar.currentState ? `, ${scholar.currentState}` : ''}
                </span>
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {scholar.bio && (
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{scholar.bio}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {scholar.year && <Badge variant="secondary">Class of {scholar.year}</Badge>}
            {scholar.major && (
              <Badge variant="secondary">
                {scholar.major}
                {scholar.school ? ` @ ${scholar.school}` : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      {showContacts && (scholar.email || scholar.cellPhone) && (
        <div className="mx-6 mb-6 rounded-lg bg-secondary p-3 text-sm">
          {scholar.email && (
            <a
              href={`mailto:${scholar.email}`}
              className="flex items-center gap-2 hover:underline"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{scholar.email}</span>
            </a>
          )}
          {scholar.cellPhone && (
            <div className="mt-1 flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{scholar.cellPhone}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
