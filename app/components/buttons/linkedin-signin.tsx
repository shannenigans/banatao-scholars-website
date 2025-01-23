import { Button } from "@/app/components/ui/button"
import { signInWithLinkedIn } from "@/app/lib/actions"

export const LinkedInSigninButton = () => {
    const handleSignIn = async () => {
      const url = await signInWithLinkedIn();
      if (url) {
        window.location.href = url;
      }
    }
    
    return (
        <Button id='linkedin-sign-in' size="lg" variant="outline" onClick={handleSignIn}>
            <img src="/linkedin_icon.svg" height={30} width={30}/>
        </Button>
    )
}