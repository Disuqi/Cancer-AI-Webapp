"use client"

import {toast} from "react-hot-toast";
import {useEffect, useState} from "react";
import {BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {Model} from "@/lib/enums/model";
import {getDetector} from "@/lib/supabase/detector";
import {rateScan, submitScan} from "@/lib/utils";
import { signedInUser } from "../atoms/authentication";
import { useRecoilState } from "recoil";

export default function Page()
{
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [user] = useRecoilState(signedInUser);
    const [detector, setDetector] = useState<any | null>(null);
    const [currentScan, setScan] = useState<any | null>();

    useEffect(() =>
    {
        getDetector(2).then(response => setDetector(response));
    }, []);

    const imageUploaded = async (e: any) =>
    {
        setScan(null);
        setImage(e.target.files[0]);
    }

    const detect = async () =>
    {
        if(currentScan)
            return toast.error("Upload a different image");
        if(!image)
            return toast.error("Upload an image first");

        setLoading(true);

        try
        {
            const scan = await toast
                .promise( submitScan(Model.LungAndColonCancer, image, detector, user), {loading: "Detecting...", success: "Detected", error: "Something went wrong!"});
            setScan(scan);
        }
        catch(e)
        {
            console.error(e);
        }
        finally
        {
            setLoading(false);
        }
    }

    const onRate = (rating: boolean) =>
    {
        rateScan(currentScan, rating).then(response => setScan(response));
    }

    return <div className="container mx-auto flex flex-col">
        <div className="flex justify-center items-center">
            <h1 className="text-3xl font-semibold">Lung & Colon Cancer Detector</h1>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center mt-10">
            <label htmlFor="image-to-scan" className="cursor-pointer text-xl font-semibold">Upload Histopathological Image</label>
            <label htmlFor="image-to-scan" className="relative bg-gray-800 rounded-md cursor-pointer w-[300px] h-[300px] hover:brightness-125">
                <p className="absolute w-full h-full opacity-0 hover:opacity-60 flex items-center justify-center top-0 left-0 bg-gray-800 transition duration-75 ease-in-out font-bold">Upload Image</p>
                {
                    image ?
                        <img src={URL.createObjectURL(image)} alt="MRI Scan" className="rounded-md w-full h-full object-cover"/>
                        :
                        <div className="w-full h-full flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="currentColor" viewBox="0 -960 960 960">
                                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
                            </svg>
                        </div>
                }
            </label>
            <input className="hidden" id="image-to-scan" type="file" accept="image/*" onInput={imageUploaded}/>
            <div className="h-10 text-center flex items-center justify-center">
                { currentScan &&
                    <div className="flex justify-center items-center gap-5">
                        <h1 className="text-lg font-medium"><span
                            className="font-bold text-indigo-300">{currentScan.result}</span> detected</h1>
                        {user && currentScan.user_id != null &&
                            <div className="flex justify-center items-center gap-2">
                                <button onClick={() => onRate(true)}
                                        className={`w-8 h-8 flex justify-center items-center rounded-full text-white hover:bg-indigo-400 ${currentScan.rating == true? "bg-indigo-500" : "bg-green-600"}`} >
                                    <BiSolidLike/></button>
                                <button onClick={() => onRate(false)}
                                        className={`w-8 h-8 flex justify-center items-center rounded-full text-white hover:bg-indigo-400 ${currentScan.rating == false? "bg-indigo-500" : "bg-red-600"}`}>
                                    <BiSolidDislike/></button>
                            </div>
                        }
                    </div>
                }
            </div>
            <button className="rounded-full px-7 py-3 m-2 bg-indigo-400 font-semibold hover:bg-indigo-300" disabled={loading} onClick={detect}>
                {loading ? "Detecting..." : "Detect"}
            </button>
        </div>
    </div>
}