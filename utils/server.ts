'use server'
import { createClient } from '@/server';

export async function fetchScholars() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from('profile').select();
  return profiles;
}