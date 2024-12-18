import { createBrowserClient } from "@/client";
import { Button } from "@/components/ui/button"

export const GoogleSignInButton = () => {
    const supabase = createBrowserClient();

    async function signInWithGoogle() {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
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
        <Button id='google-sign-in' size="lg" variant="outline" onClick={signInWithGoogle}>
            <img src="/google_icon.svg" height={30} width={30}/>
        </Button>
    )
}