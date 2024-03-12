import {atom, useRecoilState} from "recoil";
import {supabase} from "@/lib/supabase";

export const signInModalState = atom({
    key: 'signInModalState',
    default: false,
})

export const userSignedInState = atom({
    key: 'userSignedIn',
    default: false,
})