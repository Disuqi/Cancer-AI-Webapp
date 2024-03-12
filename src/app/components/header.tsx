"use client"
import LogoSVG from "@/app/svgs/logo";
import {useRecoilState} from "recoil";
import {signInModalState, userSignedInState} from "@/app/atoms/authentication";
import {supabase} from "@/lib/supabase";
import UserDropdown from "@/app/components/userdropdown";

export default function Header() {
    const [signInModalOpen, setSignInModalOpen] = useRecoilState(signInModalState);
    const [userSignedIn, setUserSignedIn] = useRecoilState(userSignedInState);
    supabase.auth.getUser().then(response =>
    {
        if(response.error)
        {
            setUserSignedIn(false);
        }else
        {
            setUserSignedIn(true);
        }
    })

    supabase.auth.onAuthStateChange((event, session) =>
    {
        switch (event)
        {
            case "SIGNED_IN":
                setUserSignedIn(true);
                break;
            case "SIGNED_OUT":
                setUserSignedIn(false);
                break;
        }
    });

    return <>
        <header className="w-screen flex flex-row justify-between container mx-auto items-center py-5">
            <a href="/" className="text-white hover:text-indigo-300 flex flex-row flex-nowrap whitespace-nowrap text-nowrap items-center justify-center gap-2">
                <LogoSVG className="w-16 h-16"/>
                <h1 className="font-black text-3xl cursor-pointer">Cancer AI</h1>
            </a>
            <div className="flex flex-row gap-10 items-center justify-center font-bold text-xl">
                <a href="/" className="hover:text-indigo-300 cursor-pointer">Home</a>
                {!userSignedIn &&
                    <button onClick={() => setSignInModalOpen(true)}
                            className="hover:text-indigo-300 cursor-pointer">Sign In</button>
                }
                {userSignedIn &&
                    <UserDropdown/>
                }
            </div>
        </header>
    </>;
}