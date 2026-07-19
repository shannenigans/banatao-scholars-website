'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/app/components/ui/button';

export default function SettingsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto flex flex-col items-center gap-3 p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p className="font-semibold">We couldn&apos;t save your profile</p>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while updating your settings. Please try again — if the photo upload
        keeps failing, try a smaller image.
      </p>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </div>
  );
}
