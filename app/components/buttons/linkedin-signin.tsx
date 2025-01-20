import { createBrowserClient } from "@/client";
import { Button } from "@/app/components/ui/button"

export const LinkedInSigninButton = () => {
    const supabase = createBrowserClient();

    async function signInWithLinkedIn() {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: `/signedIn`,
          },
        })
    
        if (error) {
          throw error
        }
      } catch (error) {
        console.log('ERROR' + error)
      }
    }
    
    return (
        <Button id='linkedin-sign-in' size="lg" variant="outline" onClick={signInWithLinkedIn}>
            <img src="/linkedin_icon.svg" height={30} width={30}/>
        </Button>
    )
}