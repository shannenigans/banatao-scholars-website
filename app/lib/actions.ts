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

export async function fetchScholars() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase.from('profile').select();

  return profiles;
}

export async function addProfile(formValues: any) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('profile').insert({ ...formValues });
  } catch (ex) {

  }
}

export async function updateProfile(id: number, formValues: any) {
  const supabase = await createClient();

  try {
    const { error, status, statusText } = await supabase.from('profile').update({ ...formValues }).eq('id', id);
  } catch (ex) {

  }
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
    console.log('signInAsUserData', signInAsUserData)
    revalidatePath('/');
    redirect('/scholars');
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const data = { email: formData.get('email') as string, password: formData.get('password') as string, phone: '' }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { errors: { formErrors: error.message }}
  } else {
    revalidatePath('/');
    redirect('/settings');
    return { errors: { formErrors: ''}}
  }
}

export async function signOut() {
    const supabase = await createClient();
    try {
        const {error} = await supabase.auth.signOut();

        if(error) {
            console.log('sign out err', error)
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

// Handle OAuth sign in server side and return redirect url
// Client side will handle redirect to ensure user is authenticated without exposing auth token
export async function signInWithGoogle() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: 'http://localhost:3000/settings'
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
        redirectTo: 'http://localhost:3000/settings',
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