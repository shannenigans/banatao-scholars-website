'use client'
import { signOut } from "@/app/lib/actions";

export const SignOut = () => {
    return (
        <span onClick={() => signOut()}>Sign out</span>
    )
}