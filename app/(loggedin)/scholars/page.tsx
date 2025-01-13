'use client';

import React from 'react';
import { Scholar } from "@/types/scholar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Footer } from "@/components/ui/footer";
import { Input } from "@/components/ui/input";
import { useDebounce } from '@/hooks/use-debounce';
import { fetchScholars } from '@/utils/server';
import { Briefcase, MapPin } from 'lucide-react';

const DELAY = 1000;
export default function ScholarsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchedScholars, setFetchedScholars] = React.useState<any>();
  const [filteredScholars, setFilteredScholars] = React.useState<Scholar[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedValue = useDebounce(searchQuery, DELAY);

  React.useEffect(() => {
    const getScholars = async () => {
      const fetchedScholars = await fetchScholars();
      setFetchedScholars(fetchedScholars);
      setIsLoading(false);
    }

    getScholars();
  }, [])

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
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Scholars</h1>
        <div className="my-4 justify-center flex">
          <Input className="w-96" placeholder="Find a scholar..." onChange={handleOnChange} />
        </div>
        <div>
          {isLoading ? renderSkeleton() : renderCards()}
        </div>
        <div className='flex my-4 justify-center "'><p>{isLoading ? '' : filteredScholars?.length + ' ' + resultString}</p></div>
      </div>
      <Footer />
    </div>
  );

  function renderCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholars?.map((scholar: Scholar) => (
          <Card key={scholar.id} className="flex flex-col">
            <CardHeader className="flex-row gap-4 items-center">
              {<Image
                src={scholar.imageUrl ? scholar.imageUrl : '/unknown_avatar.svg'}
                alt={`${scholar.firstName + ' ' + scholar.lastName}'s portrait`}
                width={100}
                height={100}
                className="rounded-full"
              />}
              <div>
                <CardTitle className='mb-1'>{scholar.firstName + ' ' + scholar.lastName}</CardTitle>
                <CardDescription>
                  {scholar.company && <div className='flex'><Briefcase className='h-4 w-4 self-center mr-1'/><span className='self-center'>{scholar.description} @ {scholar.company}</span></div>}
                  {scholar.location && <div className='flex'><MapPin className='h-4 w-4 self-center mr-1'/><span className='self-center'>{scholar.location}</span></div>}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {scholar.bio && <p className="text-sm text-muted-foreground mb-4">
                {scholar.bio}
              </p>}
              <div className="flex flex-wrap gap-2">
                {scholar.undergradGraduationYear && <Badge variant="secondary">
                  Class of {scholar.undergradGraduationYear}
                </Badge>}
                {scholar.major && <Badge variant="secondary">
                  {scholar.major} @ {scholar.undergrad}
                </Badge>}
              </div>
            </CardContent>
          </Card>
        ))}

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
