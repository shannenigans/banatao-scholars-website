/**
 * Supabase row types for the tables and view used by this application.
 *
 * Keep this file in sync with `supabase/migrations`. In an environment with
 * Supabase CLI credentials, regenerate it with `npm run db:types`.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ScholarRow = {
  id: number;
  status: string | null;
  year: string | null;
  first: string | null;
  middle: string | null;
  last: string | null;
  school: string | null;
  major: string | null;
  email: string | null;
  oldEmails: string | null;
  cellPhone: string | null;
  schoolPhone: string | null;
  homePhone: string | null;
  schoolAddress: string | null;
  schoolAddress2: string | null;
  schoolCity: string | null;
  schoolState: string | null;
  schoolZip: string | null;
  homeAddress: string | null;
  homeCity: string | null;
  homeState: string | null;
  homeZip: string | null;
  parents: string | null;
  parentsContact: string | null;
  currentAddress: string | null;
  currentCity: string | null;
  currentState: string | null;
  currentZip: string | null;
  currentPhone: string | null;
  description: string | null;
  company: string | null;
  imageUrl: string | null;
  bio: string | null;
};

export type PublicScholarRow = Pick<
  ScholarRow,
  | 'id' | 'status' | 'year' | 'first' | 'middle' | 'last' | 'school' | 'major'
  | 'currentCity' | 'currentState' | 'description' | 'company' | 'imageUrl' | 'bio'
>;

export type PrivateScholarRow = PublicScholarRow & Pick<ScholarRow, 'email' | 'cellPhone'>;

export type EventRow = {
  id: string;
  title: string;
  starts_on: string;
  ends_on: string | null;
  location: string | null;
  description: string | null;
  url: string | null;
  member_only: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
};

export type NewsRow = {
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  published_at: string | null;
  author: string | null;
  cover_image: string | null;
  category: 'news' | 'spotlight';
  scholar_id: number | null;
  featured: boolean;
  status: 'draft' | 'published';
};

export type JobPostingRow = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
  remote: boolean;
  url: string;
  posted_by: string | null;
  posted_by_user_id: string;
  posted_at: string;
  description: string | null;
  expires_at: string | null;
};

export type MentorshipSignupRow = {
  id: string;
  user_id: string;
  user_email: string;
  role: 'mentor' | 'mentee';
  areas: string[];
  bio: string | null;
  created_at: string;
};

export type GalleryAlbumRow = {
  slug: string;
  title: string;
  event_date: string | null;
  description: string | null;
  cover_image: string | null;
  bucket_path: string | null;
  status: 'draft' | 'published';
};

export type Database = {
  public: {
    Tables: {
      scholars: { Row: ScholarRow; Insert: Partial<ScholarRow>; Update: Partial<ScholarRow>; Relationships: [] };
      email_whitelist: {
        Row: { email: string; isAdmin: boolean };
        Insert: { email: string; isAdmin?: boolean };
        Update: { email?: string; isAdmin?: boolean };
        Relationships: [];
      };
      events: { Row: EventRow; Insert: Omit<EventRow, 'id'> & { id?: string }; Update: Partial<EventRow>; Relationships: [] };
      news: { Row: NewsRow; Insert: NewsRow; Update: Partial<NewsRow>; Relationships: [] };
      job_postings: {
        Row: JobPostingRow;
        Insert: Pick<JobPostingRow, 'title' | 'company' | 'type' | 'url' | 'posted_by_user_id'> & Partial<Omit<JobPostingRow, 'title' | 'company' | 'type' | 'url' | 'posted_by_user_id'>>;
        Update: Partial<JobPostingRow>;
        Relationships: [];
      };
      mentorship_signups: { Row: MentorshipSignupRow; Insert: Omit<MentorshipSignupRow, 'id' | 'created_at'> & { id?: string; created_at?: string }; Update: Partial<MentorshipSignupRow>; Relationships: [] };
      gallery_albums: { Row: GalleryAlbumRow; Insert: GalleryAlbumRow; Update: Partial<GalleryAlbumRow>; Relationships: [] };
    };
    Views: {
      public_scholars: { Row: PublicScholarRow; Relationships: [] };
      scholar_contacts: {
        Row: Pick<ScholarRow, 'id' | 'email' | 'cellPhone'>;
        Relationships: [];
      };
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_whitelisted: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
