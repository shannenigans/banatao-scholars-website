'use server'
import { createClient } from '@/server';
import { redirect } from 'next/navigation';
import { createUser, getUser } from 'app/db';
import { signIn } from 'app/auth';
import { ActionResult } from '@/app/types/ActionResult';

export async function fetchScholars() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from('profile').select();
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

export async function registerUser(prevState: any, formData: FormData) {
  let email = formData.get('email') as string; 
  let password = formData.get('password') as string;
  let user = await getUser(email);

  if (user.length > 0) {
    return { errors: { formErrors: 'Looks like this email has an associated account already.'}}; 
  } else {
    await createUser(email, password);
    redirect('/loggedin');
  }
}

export async function signInAsUser(prevState: any, formData: FormData){
  await signIn('credentials', {
    redirectTo: '/protected',
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  return { };
}