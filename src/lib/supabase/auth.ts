"use server"
import {User} from "@supabase/supabase-js";
import {client} from "@/lib/supabase/client";

export async function getUser() : Promise<User|null>
{
    try
    {
        const response = await client.auth.getUser();

        if(!response.data.user || response.error)
            return null;

        return response.data.user
    }catch (e)
    {
        return null;
    }
}

export async function signIn(email: string, password: string) : Promise<boolean>
{
    const response = await client.auth.signInWithPassword({email: email, password: password});
    return !response.error;
}

export async function signUp(username: string, email: string, password: string) : Promise<boolean>
{
    const response = await client.auth.signUp({email: email, password: password, options:
            {
                data:
                    {
                        display_name: username
                    }
            }});
    return !response.error;
}

export async function signOut() : Promise<void>
{
    await client.auth.signOut();
}

// export async function onSignIn(callback: (user: User) => void)
// {
//     // client.auth.onAuthStateChange((event, session) =>
//     // {
//     //     if(event == "SIGNED_IN")
//     //         callback(session.user);
//     // })
// }
//
// export async function onSignOut(callback: () => void)
// {
//     // client.auth.onAuthStateChange((event, session) =>
//     // {
//     //     if(event == "SIGNED_OUT")
//     //         callback();
//     // })
// }