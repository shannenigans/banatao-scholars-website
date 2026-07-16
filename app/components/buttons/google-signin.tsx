import { Button } from "@/app/components/ui/button"
import { signInWithGoogle } from "@/app/lib/actions";
import Image from 'next/image';

export const GoogleSignInButton = () => {
    const handleSignIn = async () => {
      const url = await signInWithGoogle()
      if (url) {
        window.location.href = url
      }
    }

    return (
        <Button id='google-sign-in' size="lg" variant="outline" onClick={handleSignIn}>
            <Image src="/google_icon.svg" height={30} width={30} alt="Sign in with Google" />
        </Button>
    )
}
