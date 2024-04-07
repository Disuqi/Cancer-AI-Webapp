import {Model, scanImage} from "@/lib/hugging_face";
import {Detector} from "@/lib/entities/detector";
import {User} from "@supabase/supabase-js";
import {Scan} from "@/lib/entities/scan";
import {dateToSupabaseDate} from "@/lib/date";
import {saveScan, updateScan} from "@/lib/supabase/scan";
import {increaseScanCount} from "@/lib/supabase/detector";

export async function submitScan(model: Model, image: File, detector: Detector, user: User) : Promise<Scan>
{
    const result = await scanImage(model, image);
    if(result == null)
        throw new Error("Failed to load model");

    let scan = new Scan(detector.id, result, null, dateToSupabaseDate(new Date()));
    if(user)
    {
        scan.user_id = user.id;
        scan = await saveScan(scan, image);
    }

    await increaseScanCount(detector);
    return scan;
}

export async function rateScan(scan: Scan, newRating: boolean) : Promise<Scan>
{
    let updatedScan = {...scan};

    if(updatedScan.rating == newRating)
        updatedScan.rating = null
    else
        updatedScan.rating = newRating;

    return await updateScan(updatedScan);
}