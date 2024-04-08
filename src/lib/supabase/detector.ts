"use server"
import {Detector} from "@/lib/entities/detector";
import {client} from "@/lib/supabase/client";

export async function getDetectors(): Promise<Detector[]>
{
    console.log("GET DETECTORS")
    const response = await client.from("Detectors").select("*");
    console.log(response.error)

    if(!response.data || response.error.message)
        return [];

    return response.data;
}

export async function getDetector(id: number): Promise<Detector>
{
    const response = await client.from("Detectors").select("*").eq("id", id);

    if(!response.data || response.error)
        return null;

    return response.data[0];
}

export async function getCoverImage(id: number): Promise<string>
{
    return client.storage.from("detector_cover_image").getPublicUrl(id + ".jpg").data.publicUrl;
}

export async function increaseScanCount(detector: Detector)
{
    await client.from("Detectors").update({uses: detector.uses + 1}).eq("id", detector.id);
}