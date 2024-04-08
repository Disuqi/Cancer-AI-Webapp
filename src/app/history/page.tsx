"use client"

import {Scan} from "@/lib/entities/scan";
import {useEffect, useState} from "react";
import {Detector} from "@/lib/entities/detector";
import {BiSolidDislike, BiSolidLike} from "react-icons/bi";
import ScanImageModal from "@/app/components/modals/scanImageModal";
import {IoImage} from "react-icons/io5";
import {toast} from "react-hot-toast";
import {getScanImage, getUserScans} from "@/lib/supabase/scan";
import {getDetectors} from "@/lib/supabase/detector";
import { signedInUser } from "../atoms/authentication";
import { useRecoilState } from "recoil";
import { redirect } from 'next/navigation';


export default function Page()
{
    const [scans, setScans] = useState<Scan[]>(null);
    const [detectors, setDetectors] = useState<Map<number, Detector>>(null);
    const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [user] = useRecoilState(signedInUser);


    if(!user)
        redirect('/');

    useEffect(() =>
    {
        getUserScans(user.id).then(scans => setScans(scans));
        getDetectors().then(detectors =>
            {
                let detectorMap = new Map<number, Detector>();
                detectors.forEach(detector =>
                {
                    detectorMap[detector.id] = detector;
                });
                setDetectors(detectorMap);
            });
    },[user]);

    const openImageModal = async (scan: Scan) =>
    {
        if(loading) return;
        setLoading(true);

        const downloadImagePromise = getScanImage(scan.user_id, scan.id);
        const image = await toast.promise(downloadImagePromise, {loading: "Loading Image...", success: "Image Loaded", error: "Failed to load image"});

        if(!image)
            return setLoading(false);

        setImage(image);
        setImagePreviewModal(true);
        setLoading(false);
    }

    return <div className="container mx-auto">
        <div className="px-6 py-5 text-gray-200 min-w-[300px]">
            <div className="flex flex-row items-center mb-2">
                <h1 className="text-2xl font-bold">Scan History</h1>
            </div>
            {
                scans  && detectors ?
                    <table className="w-full text-sm text-left">
                    <thead
                        className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Detector
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Result
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Rating
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-800 text-gray-300">
                    {scans.map((scan, index) => {
                        return <tr key={index} className="border-b border-gray-700">
                            <th scope="row"
                                className="px-6 py-4 font-medium whitespace-nowrap"><a className="cursor-pointer hover:text-indigo-500" href={detectors[scan.detector_id].page_href}>{detectors[scan.detector_id].title}</a></th>
                            <td className="px-6 py-4">{new Date(scan.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{scan.result}</td>
                            <td className="px-6 py-2">
                                <button onClick={() => openImageModal(scan)} className="hover:text-indigo-500 transition duration-75 ease-in-out">
                                    <IoImage className="w-7 h-7" />
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                {scan.rating == null && "Not Rated"}
                                {scan.rating == true && <BiSolidLike className="w-5 h-5 text-green-500"/>}
                                {scan.rating == false && <BiSolidDislike className="w-5 h-5 text-red-500"/>}
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
                    :
                    <p className="py-2 text-gray-400">You have not scanned anything</p>
            }
            <ScanImageModal isOpen={imagePreviewModal} setIsOpen={setImagePreviewModal} image={image}/>
        </div>
    </div>
}