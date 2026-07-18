import { SCHOLAR_STATUS } from "../lib/utils";

export interface PublicScholar {
  id: number;
  status: SCHOLAR_STATUS;
  year: string;
  first: string;
  middle?: string;
  last: string;
  school: string;
  major?: string;
  currentCity?: string;
  currentState?: string;
  
  // Additional fields not in CSV
  description: string;
  company?: string;
  imageUrl?: string;
  bio?: string;
}

export type ScholarContact = { email?: string; cellPhone?: string };

export type ScholarDirectoryEntry = PublicScholar & ScholarContact;

export type PrivateScholarProfile = PublicScholar & ScholarContact;
