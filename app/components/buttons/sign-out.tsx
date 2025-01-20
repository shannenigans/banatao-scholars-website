'use client'
import { createBrowserClient } from "@/client";

import { useRouter } from "next/navigation";

export const SignOut = () => {
    const supabase = createBrowserClient();
    const router = useRouter();

    async function signOut() {
        try {
            const {error} = await supabase.auth.signOut();

            if(error) {
                throw error;
            } else {
                router.push('/');
            }
        } catch (err) {
            console.log('Sign out error: ' + err)
        }
    }

    return (
        <span onClick={signOut}>Sign out</span>
    )
}