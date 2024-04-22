"use client"
import LogoSVG from "@/app/svgs/logo";
import {useRecoilState} from "recoil";
import {signInModalState, signedInUser} from "@/app/atoms/authentication";
import UserDropdown from "@/app/components/userdropdown";
import Link from "next/link";
import {useEffect} from "react";
import {getUser} from "@/lib/supabase/auth";

export default function Header() {
    const [signInModalOpen, setSignInModalOpen] = useRecoilState(signInModalState);
    const [signedUser, setSignedInUser] = useRecoilState(signedInUser);

    useEffect(() =>
    {
        getUser().then(user =>
        {
            if(user)
                setSignedInUser(user);
        });
    }, []);

    return <>
        <header className="w-screen flex flex-row justify-between container mx-auto items-center py-5">
            <Link href="/" className="text-white hover:text-indigo-300 flex flex-row flex-nowrap whitespace-nowrap text-nowrap items-center justify-center gap-2">
                <LogoSVG className="w-16 h-16"/>
                <h1 className="font-black text-3xl cursor-pointer">Cancer AI</h1>
            </Link>
            <div className="flex flex-row gap-10 items-center justify-center font-bold text-xl">
                <Link href="/" className="hover:text-indigo-300 cursor-pointer">Home</Link>
                {!signedUser &&
                    <button data-testid="signin-button" onClick={() => setSignInModalOpen(true)}
                            className="hover:text-indigo-300 cursor-pointer">Sign In</button>
                }
                {signedUser &&
                    <UserDropdown/>
                }
            </div>
        </header>
    </>;
}