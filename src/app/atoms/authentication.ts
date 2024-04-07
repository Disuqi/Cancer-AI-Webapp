import {atom} from "recoil";

export const signInModalState = atom({
    key: 'signInModalState',
    default: false,
})

export const userSignedInState = atom({
    key: 'userSignedIn',
    default: false,
})