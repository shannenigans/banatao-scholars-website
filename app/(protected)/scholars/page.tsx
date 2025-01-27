'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Scholar } from "@/app/types/scholar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton"
import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { useDebounce } from '@/app/hooks/use-debounce';
import { fetchScholars } from '@/app/lib/actions';
import { Briefcase, MapPin, Mail, Phone, Filter } from 'lucide-react';
import { SCHOLAR_STATUS } from '@/app/lib/utils';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DEPARTMENT, getDepartmentByMajor, MAJORS_MAP } from '@/app/lib/majors';

const DEFAULT_SCHOLARS_PER_PAGE = 6;
const DELAY = 1000;
export default function ScholarsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchedScholars, setFetchedScholars] = React.useState<any>();
  const [filteredScholars, setFilteredScholars] = React.useState<Scholar[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [majorFilters, setMajorFilters] = React.useState<Set<string>>(new Set<string>());
  const [schoolFilters, setSchoolFilters] = React.useState<Set<string>>(new Set<string>());
  const [yearFilters, setYearFilters] = React.useState<Set<string>>(new Set<string>());

  const debouncedValue = useDebounce(searchQuery, DELAY);

  React.useEffect(() => {
    const getScholars = async () => {
      const fetchedScholars = await fetchScholars();
      setFetchedScholars(fetchedScholars);
      setIsLoading(false);
    }

    getScholars();
  }, []);

  React.useEffect(() => {
    if ((schoolFilters?.size === 0 && majorFilters?.size === 0 && yearFilters?.size === 0)) {
      setFilteredScholars(fetchedScholars);
    } else {
      const newFilteredScholars = fetchedScholars?.filter((scholar: Scholar) => {
        let hasMajorFilter = false;
        if (scholar.major) {
          const department = getDepartmentByMajor(scholar.major);
          hasMajorFilter = majorFilters.has(department);
        }

        return schoolFilters?.has(scholar.school) || yearFilters.has(scholar.year) || hasMajorFilter
      });
      setFilteredScholars(newFilteredScholars);
    }
  }, [schoolFilters, majorFilters, yearFilters])

  const {majors, schools, years} = React.useMemo(() => {
    const majors = new Set<string>();
    const schools = new Set<string>();
    const years = new Set<string>();

    fetchedScholars?.forEach((scholar: Scholar) => {
      if (scholar.status === SCHOLAR_STATUS.ACTIVE || scholar.status === SCHOLAR_STATUS.GRADUATED) {
        if (scholar.year) {
          years.add(scholar.year);
        }

        if (scholar.school) {
          schools.add(scholar.school);
        }
  
        if (scholar.major) {
          if (MAJORS_MAP.get(DEPARTMENT.COMPUTER_SCIENCE)?.some((major) => scholar.major?.includes(major))) {
            majors.add(DEPARTMENT.COMPUTER_SCIENCE);
          } else if (MAJORS_MAP.get(DEPARTMENT.EARTH_SCIENCE)?.some((major) => scholar.major?.includes(major))) {
            majors.add(DEPARTMENT.EARTH_SCIENCE);
          } else if (MAJORS_MAP.get(DEPARTMENT.AERO_ENGINEERING)?.some((major) => scholar.major?.includes(major))) {
            majors.add(DEPARTMENT.AERO_ENGINEERING);
          } else if (MAJORS_MAP.get(DEPARTMENT.CIVIL_ENGINEERING)?.some((major) => scholar.major?.includes(major))) {
            majors.add(DEPARTMENT.CIVIL_ENGINEERING)
          } else if (MAJORS_MAP.get(DEPARTMENT.SYSTEMS_ENGINEERING)?.some((major) => scholar.major?.includes(major))) {
            majors.add(DEPARTMENT.SYSTEMS_ENGINEERING)
          } else if (MAJORS_MAP.get(DEPARTMENT.BIO_ENGINEERING)?.some((major) => scholar.major?.includes(major))) {
            majors.add(DEPARTMENT.BIO_ENGINEERING)
          }else {
            majors.add(scholar.major)
          }
        }
      }
    });

    return { majors, schools, years };
  }, fetchedScholars)

  React.useEffect(() => {
    if (debouncedValue !== '') {
      setFilteredScholars(fetchedScholars.filter((scholar: Scholar) => {
        return Object.values(scholar).some((value) => String(value).toLowerCase().includes(debouncedValue))
      }));
    } else {
      setFilteredScholars(fetchedScholars);
    }
  }, [debouncedValue, fetchedScholars])

  const handleOnChange = (ev: any) => {
    const searchValue = (ev.target.value).toLowerCase();
    setSearchQuery(searchValue);
  }

  const resultString = filteredScholars?.length === 1 ? ' result' : ' results';
  return (
    <div className="flex flex-col">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Scholars</h1>
        {renderSearchAndFilter()}
        <div>
          {isLoading ? renderSkeleton() : renderCards()}
        </div>
      </div>
    </div>
  );

  function renderSearchAndFilter() {
    return (
      <div className="my-4 justify-between flex">
        <div className='flex gap-2'>
        <div className='flex flex-row self-center text-sm text-muted-foreground'><Filter className='text-md pr-2' /><span className='flex self-center'>Filter by:</span> </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex flex-row self-center text-sm text-muted-foreground'>Year</DropdownMenuTrigger>
          <DropdownMenuContent className='overflow-y-scroll max-h-[200px]'>
            <DropdownMenuLabel>Year</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              Array.from(years).map((year) => {
                const handleCheckedChange = (checked: boolean) => {

                  setYearFilters((prevFilters) => {
                    const newFilterSet = new Set(prevFilters);
                    if (checked) {
                      newFilterSet.add(year);
                    } else {
                      newFilterSet.delete(year);
                    }
                    return newFilterSet;
                  })
                }

                const checked = yearFilters?.has(year);
                return (
                  <DropdownMenuCheckboxItem checked={checked} onCheckedChange={handleCheckedChange}>{year}</DropdownMenuCheckboxItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex flex-row self-center text-sm text-muted-foreground'>Major</DropdownMenuTrigger>
          <DropdownMenuContent className='overflow-y-scroll max-h-[200px]'>
            <DropdownMenuLabel>Major</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              Array.from(majors).map((major) => {
                const handleCheckedChange = (checked: boolean) => {

                  setMajorFilters((prevFilters) => {
                    const newFilterSet = new Set(prevFilters);
                    if (checked) {
                      newFilterSet.add(major);
                    } else {
                      newFilterSet.delete(major);
                    }
                    return newFilterSet;
                  })
                }

                const checked = majorFilters?.has(major);
                return (
                  <DropdownMenuCheckboxItem checked={checked} onCheckedChange={handleCheckedChange}>{major}</DropdownMenuCheckboxItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex flex-row self-center text-sm text-muted-foreground'>Schools</DropdownMenuTrigger>
          <DropdownMenuContent className='overflow-y-scroll max-h-[200px]'>
            <DropdownMenuLabel>Schools</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              Array.from(schools).map((school: string) => {
                const handleCheckedChange = (checked: boolean) => {

                  setSchoolFilters((prevFilters) => {
                    const newFilterSet = new Set(prevFilters);
                    if (checked) {
                      newFilterSet.add(school);
                    } else {
                      newFilterSet.delete(school);
                    }
                    return newFilterSet;
                  })
                }
                const checked = schoolFilters?.has(school);
                return (
                  <DropdownMenuCheckboxItem checked={checked} onCheckedChange={handleCheckedChange}>{school}</DropdownMenuCheckboxItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <div className='flex flex-row'>
          <Input className="w-96" placeholder="Search for a scholar" onChange={handleOnChange} />
          <span className='self-center text-gray-600 text-sm pl-2'>{isLoading ? '' : filteredScholars?.length + ' ' + resultString}</span>
        </div>
      </div>
    )
  }

  function renderCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholars?.map((scholar: Scholar) => renderCard(scholar))}
      </div>
    )
  }

  // function renderPagination() {
  //   const setPreviousPage = () => {
  //     setCurrentPage((page) => {
  //       if (page >= 2) {
  //         return page - 1;
  //       } else {
  //         return page
  //       }
  //     })
  //   }

  //   const setNextPage = () => {
  //     setCurrentPage((page) => {
  //       return page + 1;
  //     })
  //   }

  //   return (
  //     <Pagination>
  //       <PaginationContent>
  //         <PaginationItem>
  //           <PaginationPrevious onClick={setPreviousPage} />
  //         </PaginationItem>
  //         <PaginationItem>
  //           <PaginationLink href="#">1</PaginationLink>
  //         </PaginationItem>
  //         <PaginationItem>
  //           <PaginationNext onClick={setNextPage} />
  //         </PaginationItem>
  //       </PaginationContent>
  //     </Pagination>
  //   )
  // }

  function renderCard(scholar: Scholar) {
    return (
      (scholar.status === SCHOLAR_STATUS.ACTIVE || scholar.status === SCHOLAR_STATUS.GRADUATED) &&
      <Card key={scholar.id} className="flex flex-col">
        <CardHeader className="flex-row gap-4 items-center">
          {<Image
            src={scholar.imageUrl ? scholar.imageUrl : '/unknown_avatar.svg'}
            alt={`${scholar.first + ' ' + scholar.last}'s portrait`}
            width={100}
            height={100}
            className="rounded-full"
          />}
          <div>
            <CardTitle className='mb-1'>{scholar.first + ' ' + scholar.last}</CardTitle>
            <CardDescription>
              {scholar.company && <div className='flex'><Briefcase className='h-4 w-4 self-center mr-1' /><span className='self-center'>{scholar.description} @ {scholar.company}</span></div>}
              {scholar.currentCity && <div className='flex'><MapPin className='h-4 w-4 self-center mr-1' /><span className='self-center'>{scholar.currentCity}{scholar.currentState ? `, ${scholar.currentState}` : ''}</span></div>}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {scholar.bio && <p className="text-sm text-muted-foreground mb-4">
            {scholar.bio}
          </p>}
          <div className="flex flex-wrap gap-2">
            {scholar.year && <Badge variant="secondary">
              Class of {scholar.year}
            </Badge>}
            {scholar.major && <Badge variant="secondary">
              {scholar.major} @ {scholar.school}
            </Badge>}
          </div>
          {renderContacts(scholar)}
        </CardContent>
      </Card>
    )
  }

  function renderContacts(scholar: Scholar) {
    const shouldRenderContacts = scholar.cellPhone || scholar.email;
    return (
      shouldRenderContacts &&
      <div className='mt-2 p-3 rounded-lg bg-secondary text-sm'>
        {
          scholar.email && <div className='flex'><Mail className='h-4 w-4 self-center mr-2' /><span>{scholar.email}</span></div>
        }
        {
          scholar.cellPhone && <div className='flex'><Phone className='h-4 w-4 self-center mr-2' /><span>{scholar.cellPhone}</span></div>
        }
      </div>
    )
  }
  function renderSkeleton() {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }
}
