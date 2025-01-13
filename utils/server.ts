'use server'
import { createClient } from '@/server';

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