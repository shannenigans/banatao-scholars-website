import { createBrowserClient } from "@/client";
import { Button } from "@/components/ui/button"

export const GoogleSignInButton = () => {
    const supabase = createBrowserClient();

    async function signInWithGoogle() {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `http://localhost:3000/settings`,
          },
        })
    
        if (error) {
          throw error
        }
        
        console.log(data)
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