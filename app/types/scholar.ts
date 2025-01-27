import { SCHOLAR_STATUS } from "../lib/utils";

export interface Scholar {
  id: number;
  status: SCHOLAR_STATUS;
  year: string;
  first: string;
  middle: string;
  last: string;
  school: string;
  major?: string;
  email?: string;
  oldEmails?: string;
  cellPhone?: string;
  schoolPhone?: string;
  homePhone?: string;
  schoolAddress?: string;
  schoolAddress2?: string;
  schoolCity?: string;
  schoolState?: string;
  schoolZip?: string;
  homeAddress?: string;
  homeCity?: string;
  homeState?: string;
  homeZip?: string;
  parents?: string;
  parentsContact?: string;
  currentAddress?: string;
  currentCity?: string;
  currentState?: string;
  currentZip?: string;
  currentPhone?: string;
  
  // Additional fields not in CSV
  description: string;
  company?: string;
  imageUrl?: string;
  bio?: string
}

export const scholarKeys: (keyof Scholar)[] = [
  "status", "year", "first", "middle", "last", "school", "major", "email", 
  "oldEmails", "cellPhone", "schoolPhone", "homePhone", "schoolAddress", 
  "schoolAddress2", "schoolCity", "schoolState", "schoolZip", "homeAddress", 
  "homeCity", "homeState", "homeZip", "parents", "parentsContact", 
  "currentAddress", "currentCity", "currentState", "currentZip", "currentPhone"
];