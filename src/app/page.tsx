"use client"
import DetectorCard from "@/app/components/detector_card";
import {useEffect, useState} from "react";
import {Detector} from "@/lib/entities/detector";
import Loading from "@/app/components/loading";
import {getDetectors} from "@/lib/supabase/detector";

export default function Home() {
    const [detectors, setDetectors] = useState<Detector[]>(null);

    useEffect(() =>
    {
        getDetectors().then(detectors => setDetectors(detectors));
    }, []);

    return (
    <div className="flex flex-col gap-4 container mx-auto items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Select a Cancer Detector</h1>
      <div data-testid="model-cards-container" className="flex flex-row flex-wrap gap-2">
          {detectors ?
              detectors.map(detector => <DetectorCard key={detector.id} detector={detector}/>)
              :
              <div className="m-20"><Loading size={"w-20 h-20"}/></div>
          }
      </div>
    </div>
    );
}
