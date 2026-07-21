'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

import { rejectStory } from '@/app/lib/actions';
import { Button } from '@/app/components/ui/button';
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog';

export function DeleteStoryButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await rejectStory(slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push('/news');
      router.refresh();
    });
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setConfirmOpen(true)}>
        <Trash2 className="h-4 w-4" /> Delete
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setError(null);
        }}
        title="Delete this post?"
        description="This permanently removes it from the site. This can't be undone."
        confirmLabel="Delete"
        pending={pending}
        error={error}
        onConfirm={handleDelete}
      />
    </>
  );
}
