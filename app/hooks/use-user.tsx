import React from "react";
import { getUser, getUserProfile } from "../lib/actions";
import { User } from "@supabase/supabase-js";
import { Scholar } from "../types/scholar";

export type UserContextProps = {
    supabaseResponseUser: SupabaseResponseUserType;
    scholarProfile: Scholar | undefined;
}

const UserContext = React.createContext<UserContextProps>({ supabaseResponseUser: { user: null}, scholarProfile: undefined });
type SupabaseResponseUserType = {user: User} | { user: null} | undefined;

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState<SupabaseResponseUserType>({user: null});
    const [scholarProfile, setScholarProfile] = React.useState<Scholar | undefined>(undefined)
    React.useEffect(() => {
        async function checkUser() {
            const user =  await getUser();
            const scholarUserProfile = await getUserProfile(user?.user?.email);
            setUser(user);
            setScholarProfile(scholarUserProfile);
        }
        checkUser();
    }, [])

    return <UserContext.Provider value={{ supabaseResponseUser: user, scholarProfile }}>{children}</UserContext.Provider>
}

export default UserProvider;

export const useUser = () => {
    return React.useContext(UserContext);
}