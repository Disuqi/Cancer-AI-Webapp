"use server"
import {sleep} from "@supabase/gotrue-js/src/lib/helpers";
import { Model, ModelLabels } from "./enums/model";

export type HuggingFaceResult = { label: string, score: number }[]




const baseApiRoute = "https://api-inference.huggingface.co/models/";
const baseRequestInit : RequestInit =
    {
        headers: { Authorization : "Bearer " + process.env.HUGGING_FACE_AUTH },
        method: "POST"
    }

export async function scanImage(model : Model, formData: FormData) : Promise<string | null>
{
    const image = formData.get("image") as File;
    const apiRoute = baseApiRoute  + model;
    const init : RequestInit = {...baseRequestInit};
    init.body = image;

    let response = await fetch(apiRoute, init);
    let result = await response.json();

    while(result.hasOwnProperty("error") && result.hasOwnProperty("estimated_time"))
    {
        await sleep(result.estimated_time * 1000);

        response = await fetch(apiRoute, init);
        result = await response.json();
    }

    if(result.hasOwnProperty("error"))
        return null;

    return getHighestScoreLabel(model, result);
}

function getHighestScoreLabel(model: Model, result: HuggingFaceResult): string
{
    const labelToName = ModelLabels.get(model);

    let highestScoreLabel = result[0].label;
    let highestScore = result[0].score;

    for (let i = 1; i < result.length; i++)
    {
        if (result[i].score > highestScore)
        {
            highestScore = result[i].score;
            highestScoreLabel = result[i].label;
        }
    }

    return labelToName[highestScoreLabel];
}