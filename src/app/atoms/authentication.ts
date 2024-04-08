import {atom} from "recoil";

export const signInModalState = atom({
    key: 'signInModalState',
    default: false,
})

export const signedInUser = atom({
    key: 'signedInUser',
    default: null,
})