import { createClient } from "@supabase/supabase-js";
import type { Database } from '@/app/types/database';

export function createBrowserClient() {
    return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
        auth: {
            detectSessionInUrl: true,
            flowType: 'pkce'
        }
    });
}
