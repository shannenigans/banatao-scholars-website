/**
 * Server actions
 * This file drives all actions done by server i.e. authentication, reading and writing to DB, etc.
 * Authentication actions should be handled server side
 * and tokens will be validated in middleware.
 */
'use server'
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Scholar, scholarKeys } from '../types/scholar';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SITE_URL } from '../constants/site';
import { STATIC_EVENTS, ScholarEvent } from '../constants/events';
import { STATIC_NEWS, NewsPost } from '../constants/news';
import { STATIC_JOBS, JobPosting } from '../constants/jobs';
import { STATIC_ALBUMS, GalleryAlbum } from '../constants/gallery';

export async function parseScholarData(rawData: unknown[]) {
  const supabase = await createClient();
  const scholarRawData = rawData.slice(1) as unknown[][];
  const parsedScholarData: Scholar[] = [];
  scholarRawData.forEach((scholarInfo) => {
    if (scholarInfo.length > 0) {
      const scholar: Scholar = scholarKeys.reduce((acc, key, index) => {
        (acc as unknown as Record<string, unknown>)[key] = scholarInfo[index] ? String(scholarInfo[index]) : undefined;
        return acc;
      }, {} as Scholar);
      parsedScholarData.push(scholar);
    }
  });

  await supabase.from('scholars').insert(parsedScholarData);
}

export async function fetchScholars() {
  try {
    const supabase = await createClient();
    const { data: profiles } = await supabase.from('scholars').select().order('year', { ascending: false });
    return profiles ?? [];
  } catch {
    return [];
  }
}

export async function fetchScholarById(id: number | string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('scholars').select().eq('id', id);
    if (error || !data || data.length === 0) {
      return null;
    }
    return data[0] as Scholar;
  } catch {
    return null;
  }
}

/**
 * Returns events from a Supabase `events` table when available, otherwise
 * falls back to the curated static list so the calendar always renders.
 */
export async function fetchEvents(): Promise<ScholarEvent[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select()
      .order('date', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as ScholarEvent[];
    }
  } catch {
    // fall through to static events
  }
  return STATIC_EVENTS;
}

export async function addProfile(formData: FormData) {
  const supabase = await createClient();

  const scholarInfo = scholarKeys.reduce((acc, key) => {
    const val = formData.get(key);
    if (val !== undefined && val !== null) {
      (acc as Record<string, unknown>)[key] = val;
    }

    return acc;
  }, {} as Partial<Scholar>)

  let response: PostgrestSingleResponse<unknown> | undefined;
  try {
    response = await supabase.from('scholars').insert({ ...scholarInfo });
  } catch {

  } finally {
    return response;
  }
}

export async function updateScholar(id: number, formData: FormData) {
  const supabase = await createClient();

  const scholarInfo = scholarKeys.reduce((acc, key) => {
    const val = formData.get(key);
    if (val !== undefined && val !== null) {
      (acc as Record<string, unknown>)[key] = val;
    }

    return acc;
  }, {} as Partial<Scholar>)

  let response: PostgrestSingleResponse<unknown> | undefined;
  try {
    response = await supabase.from('scholars').update({ ...scholarInfo}).eq('id', id);
  } catch {
  }
  return response;
}

export async function signInAsUser(prevState: unknown, formData: FormData){
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Keep the redirect OUTSIDE the try/catch: redirect() throws NEXT_REDIRECT
  // by design, and we must not swallow it.
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      return { errors: { formErrors: error.message } };
    }
  } catch {
    return {
      errors: {
        formErrors: 'Unable to sign in right now. Please try again in a moment.',
      },
    };
  }

  revalidatePath('/');
  redirect('/portal');
}

export async function signup(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;

  try {
    const emailIsWhiteListed = await isEmailWhitelisted(email);
    if (!emailIsWhiteListed || emailIsWhiteListed.length !== 1) {
      return {
        errors: {
          formErrors:
            'This email isn’t on the scholar list yet. Please reach out to an administrator.',
        },
      };
    }

    const supabase = await createClient();
    const data = { email, password: formData.get('password') as string, phone: '' };
    const { error } = await supabase.auth.signUp(data);
    if (error) {
      return { errors: { formErrors: error.message } };
    }
  } catch {
    return {
      errors: {
        formErrors: 'Unable to sign up right now. Please try again in a moment.',
      },
    };
  }

  revalidatePath('/');
  redirect('/settings');
}

export async function isEmailWhitelisted(email: string) {
  try {
    const supabase = await createClient();
    const { data: matching_rows } = await supabase.from('email_whitelist').select().eq('email', email)
    return matching_rows
  } catch {
    return null;
  }
}

export async function signOut() {
    const supabase = await createClient();
    try {
        const {error} = await supabase.auth.signOut();

        if(error) {
          throw error;
        }
    } catch (err) {
        console.log('Sign out error: ' + err)
    } finally {
      redirect('/login')
    }
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data) {
      return data;
    }
  } catch {

  }
}

export async function getUserProfile(email: string | undefined) {
  if (!email) {
    return null;
  }
  try {
    const supabase = await createClient();
    const { data: scholarProfile } = await supabase.from('scholars').select().eq('email', email);
    return scholarProfile ? scholarProfile[0] : null;
  } catch {
    return null;
  }
}

// Handle OAuth sign in server side and return redirect url
// Client side will handle redirect to ensure user is authenticated without exposing auth token
export async function signInWithGoogle() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${SITE_URL}/portal`
      },
    });

    if (error) {
      throw error
    }

    return data.url;
  } catch (error) {
    console.log('ERROR' + error)
  }
}

export async function signInWithLinkedIn() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${SITE_URL}/portal`,
      },
    })

    if (error) {
      throw error
    }

    return data.url;
  } catch (error) {
    console.log('ERROR' + error)
  }
}
export async function uploadFileToBucket(formData: FormData, userId: string) {
  const supabase = await createClient();
  const file = formData.get('profilePic') as File;

  await supabase.storage.from('profile_pictures').upload(`${userId}/profile.jpg`, file, { cacheControl: '1000', upsert: true });
}

export async function getMediaFromBucket(folder: string = 'retreat_2024') {
  try {
    const supabase = await createClient();
    const media = await supabase.storage.from('media').list(folder);
    return media;
  } catch {
    return { data: [], error: null };
  }
}

/**
 * News & scholar spotlights. Prefers a Supabase `news` table when present,
 * otherwise falls back to the curated static list so the section always renders.
 */
export async function fetchNews(): Promise<NewsPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('news')
      .select()
      .order('date', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as NewsPost[];
    }
  } catch {
    // fall through to static news
  }
  return STATIC_NEWS;
}

export async function fetchNewsBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('news').select().eq('slug', slug);
    if (!error && data && data.length > 0) {
      return data[0] as NewsPost;
    }
  } catch {
    // fall through to static news
  }
  return STATIC_NEWS.find((p) => p.slug === slug) ?? null;
}

/**
 * Alumni-shared job/internship board. Prefers a Supabase `job_postings` table
 * (hiding expired roles) when present, otherwise the static sample list.
 */
export async function fetchJobs(): Promise<JobPosting[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_postings')
      .select()
      .order('posted_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      return (data as JobPosting[]).filter((j) => !j.expiresAt || j.expiresAt >= today);
    }
  } catch {
    // fall through to static jobs
  }
  return STATIC_JOBS;
}

/** Submit a new role to the board. Degrades gracefully without Supabase. */
export async function submitJobPosting(prevState: unknown, formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const company = (formData.get('company') as string)?.trim();
  const url = (formData.get('url') as string)?.trim();
  const type = (formData.get('type') as string) || 'Full-time';
  const location = (formData.get('location') as string) || '';
  const description = (formData.get('description') as string) || '';
  const postedBy = (formData.get('postedBy') as string) || '';

  if (!title || !company || !url) {
    return { errors: { formErrors: 'A title, company, and link are all required.' } };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('job_postings').insert({
      title,
      company,
      url,
      type,
      location,
      description,
      posted_by: postedBy,
      posted_at: new Date().toISOString().slice(0, 10),
    });
    if (error) {
      return {
        errors: {
          formErrors:
            'We couldn’t post that right now. Please share the role in the WhatsApp community instead.',
        },
      };
    }
  } catch {
    return {
      errors: {
        formErrors:
          'Posting isn’t available right now — please share roles in the WhatsApp community for now.',
      },
    };
  }

  revalidatePath('/jobs');
  return { success: true };
}

/** Sign up as a mentor or mentee. Degrades gracefully without Supabase. */
export async function submitMentorshipSignup(prevState: unknown, formData: FormData) {
  const role = formData.get('role') as string;
  const email = (formData.get('email') as string) || '';
  const bio = (formData.get('bio') as string) || '';
  const areas = formData.getAll('areas').map(String);

  if (role !== 'mentor' && role !== 'mentee') {
    return {
      errors: { formErrors: 'Please choose whether you’d like to be a mentor or a mentee.' },
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('mentorship_signups')
      .insert({ user_email: email, role, areas, bio });
    if (error) {
      return {
        errors: {
          formErrors:
            'We couldn’t record your sign-up. Please reach out in the WhatsApp community instead.',
        },
      };
    }
  } catch {
    return {
      errors: {
        formErrors:
          'Sign-ups aren’t available right now — please join via the WhatsApp community for now.',
      },
    };
  }

  return { success: true };
}

/**
 * Photo albums for the gallery. Prefers a Supabase `gallery_albums` table when
 * present, otherwise the static album list.
 */
export async function fetchAlbums(): Promise<GalleryAlbum[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('gallery_albums')
      .select()
      .order('date', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as GalleryAlbum[];
    }
  } catch {
    // fall through to static albums
  }
  return STATIC_ALBUMS;
}
