import {scanImage} from "@/lib/hugging_face";
import {Detector} from "@/lib/entities/detector";
import {User} from "@supabase/supabase-js";
import {Scan} from "@/lib/entities/scan";
import {dateToSupabaseDate} from "@/lib/date";
import {saveNewScan, updateScanRating} from "@/lib/supabase/scan";
import {increaseScanCount} from "@/lib/supabase/detector";
import { Model } from "./enums/model";

export async function submitScan(model: Model, image: File, detector: Detector, user: User) : Promise<Scan>
{
    const formData = new FormData();
    formData.append("image", image);

    const result = await scanImage(model, formData);
    if(result == null)
        throw new Error("Failed to load model");

    let scan = new Scan(detector.id, result, null, dateToSupabaseDate(new Date()));
    if(user)
    {
        scan = await saveNewScan(user.id, detector.id, result, formData);
    }

    await increaseScanCount(detector);
    return scan;
}

export async function rateScan(scan: Scan, newRating: boolean) : Promise<Scan>
{
    let rating = scan.rating;
    if(rating == newRating)
        rating = null
    else
        rating = newRating;

    return await updateScanRating(scan.id, rating);
}