"use server"
import {Scan} from "@/lib/entities/scan";
import { client } from "@/lib/supabase/client";
import { dateToSupabaseDate } from "../date";
import { userInfo } from "os";

export async function saveNewScan(user_id: string, detector_id : number, result: string, formData : FormData) : Promise<Scan>
{
    const image = formData.get("image");

    let scan = new Scan(detector_id, result, null, dateToSupabaseDate(new Date()));
    scan.user_id = user_id;
    scan = (await client.from("Scans").insert(scan).select()).data[0] as Scan;
    await client.storage.from("scans").upload(scan.user_id + "/" + scan.id + ".jpg", image);
    return scan;
}

export async function updateScanRating(scan_id : number, rating: boolean | null) : Promise<Scan>
{
    const scan = (await client.from("Scans").select().eq("id", scan_id).single()).data as Scan;
    scan.rating = rating;

    return (await client.from("Scans").update(scan).eq("id", scan.id).select().single()).data as Scan;
}

export async function getUserScans(userId: string) : Promise<Scan[]>
{
    return (await client.from("Scans").select("*").eq("user_id", userId)).data as Scan[];
}

export async function getDetectorScans(detectorId: number) : Promise<Scan[]>
{
    return (await client.from("Scans").select("*").eq("detector_id", detectorId)).data as Scan[];
}

export async function getScanImage(user_id: string, scan_id: number) : Promise<string>
{
    const response = (await client.storage.from("scans").createSignedUrl(user_id + "/" + scan_id + ".jpg", 1800)).data;
    if(response)
        return response.signedUrl;
    else
        throw new Error("Unable to load image");
}