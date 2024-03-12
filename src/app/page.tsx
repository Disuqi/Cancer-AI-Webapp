"use client"
import DetectorCard from "@/app/components/detector_card";
import {useEffect, useState} from "react";
import {Detector} from "@/lib/entities/detector";
import Loading from "@/app/components/loading";
import {supabase} from "@/lib/supabase";

export default function Home() {
    const [detectors, setDetectors] = useState<Detector[]>([]);

    useEffect(() =>
    {
        supabase.from("Detectors").select("*").then(response =>
        {
            if(response.error)
            {
                console.error(response.error);
            }else
            {
                setDetectors(response.data as Detector[]);
            }
        });
    }, []);

    return (
    <div className="flex flex-col gap-4 container mx-auto items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Select a Cancer Detector</h1>
      <div className="flex flex-row flex-wrap gap-2">
          {detectors.length > 0 ?
              detectors.map(detector => <DetectorCard key={detector.id} detector={detector}/>)
              :
              <div className="m-20"><Loading size={"w-20 h-20"}/></div>
          }
      </div>
    </div>
    );
}
