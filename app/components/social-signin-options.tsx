"use client";

import { GoogleSignInButton } from './buttons/google-signin';
import { LinkedInSigninButton } from  './buttons/linkedin-signin';
import '../styles/globals.css'

export const SocialSigninOptions = () => {
    return (
        <div className="signin-button-container">        
            <GoogleSignInButton />
            <LinkedInSigninButton />
        </div>   
    )
}