"use client"
import {RecoilRoot, useRecoilState} from "recoil";
import Header from "@/app/components/header";
import {Toaster} from "react-hot-toast";
import AuthenticationModal from "@/app/components/modals/authentication";

export default function Root(props: {children})
{
    return <RecoilRoot>
        <Header/>
        {props.children}
        <Toaster toastOptions={{style: { background: "#212936", color: "whitesmoke"}}}/>
        <AuthenticationModal/>
        <Toaster/>
    </RecoilRoot>
}