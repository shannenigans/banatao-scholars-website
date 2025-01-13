export interface Scholar {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  location?: string;
  description: string;
  gradGraduationYear?: number;
  undergradGraduationYear?: number
  company?: string;
  imageUrl?: string;
  undergrad?: string;
  bio?: string;
  grad?: string;
  major?: string;
}
