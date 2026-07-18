'use client';

import React from 'react';
import XLSX from 'xlsx';

import { parseScholarData } from '@/app/lib/actions';
import { ALLOWED_FILE_TYPES } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

const MAX_IMPORT_BYTES = 5_000_000;

export default function ImportScholarForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return setMessage('Select a spreadsheet or CSV file.');
    if (!ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_IMPORT_BYTES) {
      return setMessage('Use one CSV or XLSX file no larger than 5 MB.');
    }

    setPending(true);
    setMessage(null);
    try {
      const workbook = XLSX.read(await file.arrayBuffer());
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!firstSheet) return setMessage('The workbook does not contain a worksheet.');
      if (firstSheet['!ref']) {
        const range = XLSX.utils.decode_range(firstSheet['!ref']);
        const rowCount = range.e.r - range.s.r + 1;
        const columnCount = range.e.c - range.s.c + 1;
        if (rowCount > 1001 || columnCount > 31) {
          return setMessage('Imports are limited to one header, 1,000 records, and 31 columns.');
        }
      }
      const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1 });
      const result = await parseScholarData(rows);
      setMessage(result.success ? 'Scholar records imported.' : result.errors?.formErrors ?? 'Import failed.');
      if (result.success) setFile(null);
    } catch {
      setMessage('The file could not be read. Check its format and try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="scholar-import">Import scholar information</Label>
        <Input
          id="scholar-import"
          type="file"
          accept=".csv,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-2"
        />
      </div>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" disabled={pending}>{pending ? 'Importing…' : 'Upload file'}</Button>
    </form>
  );
}
