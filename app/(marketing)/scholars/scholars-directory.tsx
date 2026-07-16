'use client';

import React from 'react';
import { Filter, Eraser, Lock } from 'lucide-react';

import type { ScholarDirectoryEntry } from '@/app/types/scholar';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';
import { useDebounce } from '@/app/hooks/use-debounce';
import { SCHOLAR_STATUS } from '@/app/lib/utils';
import { getDepartmentByMajor } from '@/app/lib/majors';
import { ScholarCard } from '@/app/components/marketing/scholar-card';

const SCHOLARS_PER_PAGE = 9;
const DEBOUNCE_DELAY = 400;

function isVisible(s: ScholarDirectoryEntry) {
  return s.status === SCHOLAR_STATUS.ACTIVE || s.status === SCHOLAR_STATUS.GRADUATED;
}

export function ScholarsDirectory({
  initialScholars,
  showContacts,
  unavailable,
}: {
  initialScholars: ScholarDirectoryEntry[];
  showContacts: boolean;
  unavailable: boolean;
}) {
  const allScholars = React.useMemo(() => initialScholars.filter(isVisible), [initialScholars]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [yearFilters, setYearFilters] = React.useState<Set<string>>(new Set());
  const [majorFilters, setMajorFilters] = React.useState<Set<string>>(new Set());
  const [schoolFilters, setSchoolFilters] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const { years, majors, schools } = React.useMemo(() => {
    const years = new Set<string>();
    const majors = new Set<string>();
    const schools = new Set<string>();
    allScholars.forEach((s) => {
      if (s.year) years.add(s.year);
      if (s.school) schools.add(s.school);
      if (s.major) majors.add(getDepartmentByMajor(s.major) || s.major);
    });
    return { years, majors, schools };
  }, [allScholars]);

  const hasFilters =
    yearFilters.size > 0 || majorFilters.size > 0 || schoolFilters.size > 0;

  const filtered = React.useMemo(() => {
    let result = allScholars;

    if (hasFilters) {
      result = result.filter((s) => {
        const matchYear = s.year ? yearFilters.has(s.year) : false;
        const matchSchool = s.school ? schoolFilters.has(s.school) : false;
        const matchMajor = s.major
          ? majorFilters.has(getDepartmentByMajor(s.major)) || majorFilters.has(s.major)
          : false;
        return (
          (yearFilters.size === 0 || matchYear) &&
          (schoolFilters.size === 0 || matchSchool) &&
          (majorFilters.size === 0 || matchMajor)
        );
      });
    }

    if (debouncedQuery.trim() !== '') {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((s) =>
        Object.values(s).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return result;
  }, [allScholars, hasFilters, yearFilters, majorFilters, schoolFilters, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / SCHOLARS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * SCHOLARS_PER_PAGE, page * SCHOLARS_PER_PAGE);

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
    checked: boolean,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  };

  const clearAll = () => {
    setYearFilters(new Set());
    setMajorFilters(new Set());
    setSchoolFilters(new Set());
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">Our Scholars</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          The engineers, scientists, and builders of the Banatao Scholars community.
        </p>
      </div>

      {!showContacts && (
        <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0" />
          Sign in as a scholar to see contact details.
        </div>
      )}

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" /> Filter
          </span>
          <FilterMenu label="Year" values={years} selected={yearFilters} onToggle={(v, c) => toggle(setYearFilters, v, c)} />
          <FilterMenu label="Major" values={majors} selected={majorFilters} onToggle={(v, c) => toggle(setMajorFilters, v, c)} />
          <FilterMenu label="School" values={schools} selected={schoolFilters} onToggle={(v, c) => toggle(setSchoolFilters, v, c)} />
          <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasFilters && searchQuery === ''}>
            <Eraser className="h-4 w-4" /> Clear
          </Button>
        </div>
        <Input
          className="sm:w-72"
          placeholder="Search scholars…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {`${filtered.length} ${filtered.length === 1 ? 'scholar' : 'scholars'}`}
      </p>

      {/* Grid */}
      {paged.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          {unavailable
            ? 'The scholar directory is temporarily unavailable.'
            : 'No scholars match your search.'}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paged.map((s) => (
            <ScholarCard key={s.id} scholar={s} showContacts={showContacts} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function FilterMenu({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: Set<string>;
  selected: Set<string>;
  onToggle: (value: string, checked: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {label}
          {selected.size > 0 ? ` (${selected.size})` : ''}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-64 overflow-y-auto">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Array.from(values)
          .sort()
          .map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={selected.has(value)}
              onCheckedChange={(checked) => onToggle(value, Boolean(checked))}
              onSelect={(e) => e.preventDefault()}
            >
              {value}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
