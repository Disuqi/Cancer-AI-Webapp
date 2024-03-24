import Link from 'next/link';
import {Detector} from "@/lib/entities/detector";
import {supabase} from "@/lib/supabase";
import {useEffect, useState} from "react";
import {Scan} from "@/lib/entities/scan";
import {FaStar} from "react-icons/fa";
import {BiSolidDislike, BiSolidLike} from "react-icons/bi";

export default function DetectorCard(props: {detector: Detector})
{
    const [rating, setRating] = useState<{positive: number, negative: number} | null>(null);
    const image = supabase.storage.from("detector_cover_image").getPublicUrl(props.detector.id.toString() + ".jpeg").data.publicUrl;

    useEffect(() =>
    {
        supabase.from("Scans").select("rating").eq("detector_id", props.detector.id).then(response =>
        {
            if(response.error)
            {
                console.error(response.error);
                setRating(null);
            }
            else
            {
                const scans = response.data;
                let positive = 0;
                let negative = 0;
                scans.forEach((scan: Scan) =>
                {
                    if(scan.rating == true)
                        positive++;
                    else if(scan.rating == false)
                        negative++;
                });
                setRating({positive: positive, negative: negative});
            }
        });
    }, []);
    return (
    <Link href={props.detector.page_href}>
    <div className="bg-gray-800 border-gray-700 border flex flex-col rounded-md w-[300px] hover:brightness-125 transition duration-150 ease-in-out">
        <div className="bg-black rounded-t-md">
            <img className="object-contain w-96 h-48" src={image}/>
        </div>
        <div className="p-3 border-gray-700 border-t">
          <h1 className="text-white font-bold text-lg">{props.detector.title}</h1>
          <h2 className="text-gray-400 text-md">{props.detector.description}</h2>
        </div>
        <div className="p-3 flex flex-row gap-2 text-white text-sm border-gray-700 border-t">
            {rating &&
                <>
                    <p className="flex gap-2 justify-center items-center font-semibold">{rating.positive} <BiSolidLike/>
                    </p>
                    <p className="text-gray-700">|</p>
                    <p className="flex gap-2 justify-center items-center font-semibold">{rating.negative} <BiSolidDislike/></p>
                    <p className="text-gray-700">|</p>
                </>}
            <p className="font-semibold">{props.detector.uses} Uses</p>
        </div>
    </div>
    </Link>
    );
}