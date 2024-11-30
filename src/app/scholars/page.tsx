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
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

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

export default function ScholarsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Scholars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholars.map((scholar) => (
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
      </main>
      <Footer />
    </div>
  );
}
