"use client"
import Modal from "react-modal";
import {defaultModalStyle} from "@/lib/constants";
import {IoIosCloseCircle} from "react-icons/io";

export default function ScanImageModal(props: {isOpen: boolean, setIsOpen: (b : boolean) => void, image: string})
{
    return <Modal
        style={defaultModalStyle}
        isOpen={props.isOpen}
        onRequestClose={() => props.setIsOpen(false)}
    >
        <div className="p-10 bg-gray-800 text-gray-200 flex flex-col justify-center items-center">
            <div className="flex flex-row items-center mb-4 w-full">
                <h1 className="text-2xl font-bold">Uploaded scan image</h1>
                <button className="ml-auto hover:text-red-600 transition duration-100 ease-in-out"
                        onClick={() => props.setIsOpen(false)}><IoIosCloseCircle className="w-6 h-6"/></button>
            </div>
            <img src={props.image} alt="Uploaded scan image" className="w-auto max-h-[500px]"/>
        </div>
    </Modal>
}
