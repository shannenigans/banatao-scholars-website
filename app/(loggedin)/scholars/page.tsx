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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Footer } from "@/components/ui/footer";
import { Input } from "@/components/ui/input";
import { useDebounce } from '@/hooks/use-debounce';
// Mock data for scholars
const scholars: Scholar[] = [
  {
    id: "1",
    name: "Benedict Taguinod",
    location: "Bay Area",
    description: "Software Engineer specializing in Edtech",
    school: "UC Berkeley",
    year_graduated: 2023,
    company: "Hewlett Packard Enterprise",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4D03AQEhmBx_oFEG5w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1699982577609?e=1738195200&v=beta&t=A1B5l-4heaGlDeH7AoGAp_rMjvmTob8fX2xG2sTug4I",
  },
];

const DELAY = 1000;
export default function ScholarsPage() {
  const [filteredScholars, setFilteredScholars] = React.useState<Scholar[]>(scholars);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedValue = useDebounce(searchQuery, DELAY);

  React.useEffect(() => {
    if (debouncedValue !== '') {
      setFilteredScholars(scholars.filter((scholar: Scholar) => {
        return Object.values(scholar).some((value) => String(value).toLowerCase().includes(debouncedValue))
      }));
    } else {
      setFilteredScholars(scholars);
    }
  }, [debouncedValue, scholars])

  const handleOnChange = (ev: any) => {
    const searchValue = (ev.target.value).toLowerCase();
    setSearchQuery(searchValue);
  }

  const resultString = filteredScholars.length === 1 ? ' result' : ' results';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Scholars</h1>
        <div className="my-4 justify-center flex">
          <Input className="w-96" placeholder="Find a scholar..." onChange={handleOnChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholars.map((scholar) => (
            <Card key={scholar.id} className="flex flex-col">
              <CardHeader className="flex-row gap-4 items-center">
                <Image
                  src={scholar.imageUrl}
                  alt={`${scholar.name}'s portrait`}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <CardTitle>{scholar.name}</CardTitle>
                  <CardDescription>{scholar.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {scholar.company}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Class of {scholar.year_graduated}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='flex my-4 justify-center "'><p>{filteredScholars.length} {resultString}</p></div>
      </div>
      <Footer />
    </div>
  );
}
