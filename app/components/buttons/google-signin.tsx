import { Button } from "@/app/components/ui/button"
import { signInWithGoogle } from "@/app/lib/actions";

export const GoogleSignInButton = () => {
    const handleSignIn = async () => {
      const url = await signInWithGoogle()
      if (url) {
        window.location.href = url
      }
    }

    return (
        <Button id='google-sign-in' size="lg" variant="outline" onClick={handleSignIn}>
            <img src="/google_icon.svg" height={30} width={30}/>
        </Button>
    )
}