"use client"

import Modal from "react-modal";
import {IoIosCloseCircle} from "react-icons/io";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {signInModalState, signedInUser} from "@/app/atoms/authentication";
import {toast} from "react-hot-toast";
import {defaultModalStyle} from "@/lib/constants";
import {getUser, signIn, signUp, resetPassword} from "@/lib/supabase/auth";


export default function AuthenticationModal()
{
    const [formState, setFormState] = useState<"Sign In" | "Sign Up" | "Almost done" | "Reset Password">("Sign In");
    const [signInModalOpen, setSignInModalOpen] = useRecoilState(signInModalState);
    const [signedUser, setSignedUser] = useRecoilState(signedInUser);

    useEffect(() =>
    {
        setFormState("Sign In");
    }, [signInModalOpen]);

    const submitSignIn = async (e: any) =>
    {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        const success = await signIn(email, password);
        if(!success)
            return toast.error("Invalid credentials!");

        const user = await getUser();
        if(!user)
            return toast.error("Failed to sign in!");

        toast.success("Signed in!");
        setSignInModalOpen(false);
        setSignedUser(user);
    }

    const submitSignUp = async (e: any) =>
    {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        if(password !== confirmPassword)
            return toast.error("Passwords do not match!");

        const success = await signUp(username, email, password);
        if(!success)
            return toast.error("Failed to sign up!");

        const user = await getUser();
        if(user)
            setSignedUser(user);

        toast.success("Email sent!");
        setFormState("Almost done");
    }

    const submitResetPassword = async (e: any) =>
    {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const success = await resetPassword(email);
        if(!success)
            return toast.error("Failed to reset password!");
        setFormState("Almost done");
    }
    return <Modal
            ariaHideApp={false}
            style={defaultModalStyle}
            isOpen={signInModalOpen}
            onRequestClose={() => setSignInModalOpen(false)}
            >
        <div data-testid="auth-modal" className="p-10 bg-gray-800 text-gray-200">
            <div className="flex flex-row items-center mb-2">
                <h1 className="text-2xl font-bold">{formState}</h1>
                <button data-testid="close-auth-modal" className="ml-auto hover:text-red-600 transition duration-100 ease-in-out"
                        onClick={() => setSignInModalOpen(false)}><IoIosCloseCircle className="w-6 h-6"/></button>
            </div>
            {formState === "Sign In" &&
                    <form data-testid="signin-form" className="flex flex-col gap-2" onSubmit={submitSignIn}>
                        <div className="flex flex-col">
                            <label  className="font-semibold">Email</label>
                            <input data-testid="email-input" className="p-1 text-black rounded-md" name="email" type="email"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Password</label>
                            <input data-testid="password-input" className="p-1 text-black rounded-md" name="password" type="password"/>
                        </div>
                        <div>
                            <div>
                                <p className="text-sm text-gray-400">Forgot Password?&nbsp;
                                <button
                                    type="button"
                                    data-testid="reset-password-button"
                                    className="underline text-indigo-400 hover:text-indigo-300"
                                    onClick={() => setFormState("Reset Password")}>Reset
                                    </button>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Don&apos;t have an account? 
                                <button
                                    type="button"
                                    data-testid="signup-button"
                                    className="underline text-indigo-400 hover:text-indigo-300"
                                    onClick={() => setFormState("Sign Up")}>Sign Up
                                    </button>
                                </p>
                            </div>
                        </div>
                        <div data-testid="submit-signin" className="flex justify-center mt-6">
                            <button
                                className="font-semibold py-2 px-4 text-sm rounded-full bg-indigo-500 hover:bg-indigo-400"
                                type="submit">Sign In
                            </button>
                        </div>
                    </form>
            }
            {formState === "Sign Up" &&
                <form data-testid="signup-form" className="flex flex-col gap-2" onSubmit={submitSignUp}>
                    <div className="flex flex-col">
                        <label className="font-semibold">Username</label>
                        <input data-testid="username-input" className="p-1 text-black rounded-md" name="username" type="text"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Email</label>
                        <input data-testid="email-input" className="p-1 text-black rounded-md" name="email" type="email"/>
                    </div>
                    <div className="flex flex-col mt-2">
                        <label className="font-semibold">Password</label>
                        <input data-testid="password-input" className="p-1 text-black rounded-md" name="password" type="password"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Confirm Password</label>
                        <input data-testid="confirm-password-input" className="p-1 text-black rounded-md" name="confirmPassword" type="password"/>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Already have an account? <button
                            type="button"
                            data-testid="modal-sign-in-button"
                            className="underline text-indigo-400 hover:text-indigo-300"
                            onClick={() => setFormState("Sign In")}>Sign In</button></p>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button data-testid="submit-signup"
                            className="font-semibold py-2 px-4 text-sm rounded-full bg-indigo-500 hover:bg-indigo-400"
                            type="submit">Sign Up
                        </button>
                    </div>
                </form>
            }
            {formState === "Almost done" &&
                <div className="flex flex-col gap-2">
                    <h2>You&apos;ve got mail!</h2>
                </div>
            }
            {formState === "Reset Password" &&
                <div className="flex flex-col gap-2">
                    <form data-testid="reset-password-form" className="flex flex-col gap-2" onSubmit={submitResetPassword}>
                        <div className="flex flex-col">
                            <label  className="font-semibold">Email</label>
                            <input data-testid="email-input" className="p-1 text-black rounded-md" name="email" type="email"/>
                        </div>
                        <div>
                            <div>
                                <p className="text-sm text-gray-400">Remembered Password?&nbsp;
                                <button
                                    type="button"
                                    data-testid="signup-button"
                                    className="underline text-indigo-400 hover:text-indigo-300"
                                    onClick={() => setFormState("Sign In")}>Sign In
                                    </button>
                                </p>
                            </div>
                        </div>
                        <div data-testid="submit-signin" className="flex justify-center mt-6">
                            <button
                                className="font-semibold py-2 px-4 text-sm rounded-full bg-indigo-500 hover:bg-indigo-400"
                                type="submit">Reset
                            </button>
                        </div>
                    </form>
                </div>
            }
        </div>
    </Modal>
}