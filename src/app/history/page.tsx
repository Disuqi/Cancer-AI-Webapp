"use client"

import {Scan} from "@/lib/entities/scan";
import {useEffect, useState} from "react";
import {Detector} from "@/lib/entities/detector";
import {BiSolidDislike, BiSolidLike} from "react-icons/bi";
import ScanImageModal from "@/app/components/modals/scanImageModal";
import {IoImage} from "react-icons/io5";
import {toast} from "react-hot-toast";
import {getUser} from "@/lib/supabase/auth";
import {getScanImage, getUserScans} from "@/lib/supabase/scan";
import {getDetectors} from "@/lib/supabase/detector";

export default function Page()
{
    const [scans, setScans] = useState<Scan[]>([]);
    const [detectors, setDetectors] = useState<Map<number, Detector>>(new Map<number, Detector>());
    const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() =>
    {
        getUser().then(user => {
            if (user == null)
                return;
            getUserScans(user.id).then(scans => setScans(scans));
        });

        getDetectors().then(detectors =>
        {
            let detectorMap = new Map<number, Detector>();
            detectors.forEach(detector =>
            {
                detectorMap[detector.id] = detector;
            });
            setDetectors(detectorMap);
        });
    },[]);

    const openImageModal = async (scan: Scan) =>
    {
        if(loading) return;
        setLoading(true);

        const downloadImagePromise = getScanImage(scan);
        const imageData = await toast.promise(downloadImagePromise, {loading: "Loading Image...", success: "Image Loaded", error: "Failed to load image"});

        if(!imageData)
            return setLoading(false);

        const image = URL.createObjectURL(imageData);
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
                scans.length == 0 ?
                    <p className="py-2 text-gray-400">You have not scanned anything</p>
                    :
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                        <tbody className="bg-gray-800">
                        {scans.map((scan, index) => {
                            return <tr key={index} className="border-b border-gray-700">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"><a className="cursor-pointer hover:text-indigo-500" href={detectors[scan.detector_id].page_href}>{detectors[scan.detector_id].title}</a></th>
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
            }
            <ScanImageModal isOpen={imagePreviewModal} setIsOpen={setImagePreviewModal} image={image}/>
        </div>
    </div>
}