"use server"
import {Scan} from "@/lib/entities/scan";
import { client } from "@/lib/supabase/client";

export async function saveScan(scan : Scan, image : File) : Promise<Scan>
{
    scan = (await client.from("Scans").insert(scan).select()).data[0] as Scan;
    await client.storage.from("scans").upload(scan.user_id + "/" + scan.id + ".jpg", image);
    return scan;
}

export async function updateScan(scan : Scan) : Promise<Scan>
{
    return (await client.from("Scans").update(scan).eq("id", scan.id).select()).data[0] as Scan;
}

export async function getUserScans(userId: string) : Promise<Scan[]>
{
    return (await client.from("Scans").select("*").eq("user_id", userId)).data as Scan[];
}

export async function getDetectorScans(detectorId: number) : Promise<Scan[]>
{
    return (await client.from("Scans").select("*").eq("detector_id", detectorId)).data as Scan[];
}

export async function getScanImage(scan: Scan) : Promise<Blob>
{
    return (await client.storage.from("scans").download(scan.user_id + "/" + scan.id + ".jpg")).data;
}