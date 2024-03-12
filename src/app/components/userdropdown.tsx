import {Menu, Transition} from "@headlessui/react";
import React, {Fragment} from "react";
import {TiUser} from "react-icons/ti";
import {supabase} from "@/lib/supabase";
import {toast} from "react-hot-toast";

export default function UserDropdown()
{
    const singOut = async () =>
    {
        const response = await supabase.auth.signOut();
        if(response.error)
        {
            toast.error("Failed to sign out!");
        }
        else
        {
            toast.success("Signed out!");
        }
    }
    return <Menu as="div" className="relative">
            <Menu.Button className="bg-gray-100 text-gray-900 rounded-full hover:bg-indigo-400">
                <TiUser className="w-8 h-8 m-1"/>
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
                    className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-800 text-gray-100 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="p-1">
                        <Menu.Item>
                            {({active}) => (
                                <button
                                    className={`${
                                        active && 'bg-indigo-400'
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    History
                                </button>
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
}