"use client"

import { toast } from "react-hot-toast";
import {useEffect, useState} from "react";
import {BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {Scan} from "@/lib/entities/scan";
import {dateToSupabaseDate} from "@/lib/date";
import {getDetector, increaseScanCount} from "@/lib/supabase/detector";
import {rateScan} from "@/lib/utils";
import { useRecoilState } from "recoil";
import {signedInUser} from "@/app/atoms/authentication";
import { saveNewScan } from "@/lib/supabase/scan";

export default function Page()
{
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [user] = useRecoilState(signedInUser);
    const [detector, setDetector] = useState<any | null>(null);
    const [currentScan, setScan] = useState<any | null>();

    useEffect(() =>
    {
        getDetector(1).then(response => setDetector(response));
    }, []);

    const imageUploaded = async (e: any) =>
    {
        setScan(null);
        setImage(e.target.files[0]);
    }

    const detect = async () =>
    {
        if(currentScan)
        {
            toast.error("Upload a different image");
            return;
        }

        setLoading(true);

        if(image == null)
        {
            toast.error("Upload an image first");
            setLoading(false);
            return;
        }

        try
        {

            const response = await toast
                .promise( submitScan(image, detector, user), {loading: "Detecting...", success: "Detected", error: "Something went wrong!"});
            const scan = response as Scan;
            setScan(scan);
        }
        catch(e)
        {
            console.error(e);
        }
        setLoading(false);
    }

    const onRate = (rating: boolean) =>
    {
        rateScan(currentScan, rating).then(response => setScan(response));
    }

    return <div className="container mx-auto flex flex-col">
        <div className="flex justify-center items-center">
            <h1 className="text-3xl font-semibold">Brain Tumor Detector</h1>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center mt-10">
            <label htmlFor="image-to-scan" className="cursor-pointer text-xl font-semibold">Upload MRI Scan</label>
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

async function submitScan(image, detector, user): Promise<Scan>
{
    const formData = new FormData();
    formData.append("image", image);

    const apiResponse = await fetch("http://127.0.0.1:5000/api/v1/models/brain_tumor",
        {
            method: "POST",
            body: formData,
        });

    const result = await apiResponse.json();
    let scan = new Scan(detector.id, result, null, dateToSupabaseDate(new Date()));
    if(user)
    {
        const formData = new FormData();
        formData.append("image", image);
        scan = await saveNewScan(user.id, scan.detector_id, result, formData);
    }

    await increaseScanCount(detector);
    return scan;

}