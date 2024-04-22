import {Menu, Transition} from "@headlessui/react";
import React, {Fragment, useState} from "react";
import {TiUser} from "react-icons/ti";
import {toast} from "react-hot-toast";
import Link from "next/link";
import {signOut} from "@/lib/supabase/auth";
import { signedInUser } from "../atoms/authentication";
import { useRecoilState } from "recoil";

export default function UserDropdown()
{
    const [user, setSignedInUser] = useRecoilState(signedInUser);

    const singOut = async () =>
    {
        await signOut();
        setSignedInUser(null);
        toast.success("Signed out!");
    }

    return <>
            <Menu as="div" className="relative">
            <Menu.Button className="bg-gray-100 text-gray-900 rounded-full hover:bg-indigo-400">
                <TiUser title="User Dropdown" className="w-8 h-8 m-1"/>
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-800 text-gray-100 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="p-1">
                        <Menu.Item>
                            {({active}) => (
                                <Link href="/history" className={`${
                                    active && 'bg-indigo-500'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    History
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({active}) => (
                                <button
                                    className={`${
                                        active && 'bg-red-500'
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={singOut}
                                >
                                    Sign Out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    </>

}