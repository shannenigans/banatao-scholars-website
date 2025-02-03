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

export async function parseScholarData(rawData: any[]) {
  const supabase = await createClient();
  const scholarRawData = rawData.slice(1);
  const parsedScholarData: Scholar[] = [];
  scholarRawData.forEach((scholarInfo: string[]) => {
    if (scholarInfo.length > 0) {
      const scholar: Scholar = scholarKeys.reduce((acc, key, index) => {
        acc[key as keyof Scholar] = scholarInfo[index] ? scholarInfo[index].toString() : undefined;
        return acc;
      }, {} as Scholar);
      parsedScholarData.push(scholar);
    }
  });

  const {error} = await supabase.from('scholars').insert(parsedScholarData);
}

export async function fetchScholars() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase.from('scholars').select().order('year', { ascending: false });

  return profiles;
}

export async function addProfile(formData: FormData) {
  const supabase = await createClient();

  const scholarInfo = scholarKeys.reduce((acc, key) => {
    const val = formData.get(key);
    if (val !== undefined && val !== null) {
      acc[key] = val; 
    }

    return acc;
  }, {} as Partial<Scholar>)

  let response: PostgrestSingleResponse<any> | undefined;
  try {
    response = await supabase.from('scholars').insert({ ...scholarInfo });
  } catch (ex) {

  } finally {
    return response;
  }
}

export async function updateScholar(id: number, formData: FormData) {
  const supabase = await createClient();

  const scholarInfo = scholarKeys.reduce((acc, key) => {
    const val = formData.get(key);
    if (val !== undefined && val !== null) {
      acc[key] = val; 
    }

    return acc;
  }, {} as Partial<Scholar>)

  let response: PostgrestSingleResponse<any> | undefined;
  try {
    response = await supabase.from('scholars').update({ ...scholarInfo}).eq('id', id);
  } catch (ex) {
  }
  return response;
}

export async function signInAsUser(prevState: any, formData: FormData){
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: signInAsUserData, error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return { errors: { formErrors: error.message }}
  } else {
    revalidatePath('/');
    redirect('/scholars');
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  
  const emailIsWhiteListed = await isEmailWhitelisted(email);
  
  if (!emailIsWhiteListed) {
    revalidatePath('/');
    redirect('/loginError');
  }

  const data = { email, password: formData.get('password') as string, phone: '' }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { errors: { formErrors: error.message }}
  } else {
    revalidatePath('/');
    redirect('/profile');
    return { errors: { formErrors: ''}}
  }
}

export async function isEmailWhitelisted(email: string) {
  const supabase = await createClient();
  const { data: matching_rows } = await supabase.from('email_whitelist').select().eq('email', email)
  return matching_rows
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
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (data) {
      return data;
    }
  } catch (ex) {

  }
}

export async function getUserProfile(email: string | undefined) {
  const supabase = await createClient();
  if (email) {
    const { data: scholarProfile } = await supabase.from('scholars').select().eq('email', email);
    return scholarProfile ? scholarProfile[0] : null;
  }
  return null;
}

// Handle OAuth sign in server side and return redirect url
// Client side will handle redirect to ensure user is authenticated without exposing auth token
export async function signInWithGoogle() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: 'http://localhost:3000/profile'
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
        redirectTo: 'http://localhost:3000/profile',
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

  const { data, error } = await supabase.storage.from('profile_pictures').upload(`${userId}/profile.jpg`, file, { cacheControl: '1000', upsert: true });
}

export async function getMediaFromBucket() {
  const supabase = await createClient();
  const media = await supabase.storage.from('media').list('retreat_2024')
  return media;
}

