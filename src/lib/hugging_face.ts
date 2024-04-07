"use server"
import {sleep} from "@supabase/gotrue-js/src/lib/helpers";

export type HuggingFaceResult = { label: string, score: number }[]

export enum Model
{
    LungAndColonCancer = "DunnBC22/vit-base-patch16-224-in21k_lung_and_colon_cancer",
    SkinCancer = "Anwarkh1/Skin_Cancer-Image_Classification"
}

const labels =
    {
        LungAndColonCancer :
            {
                "lung_aca": "Lung Adenocarcinoma",
                "lung_scc": "Lung Squamous Cell Carcinoma",
                "lung_n": "Lung Neuroendocrine Tumor",
                "colon_n": "Colon Neuroendocrine Tumor",
                "colon_aca": "Colon Adenocarcinoma"
            },
        SkinCancer :
            {
                "basal_cell_carcinoma": "Basal Cell Carcinoma",
                "vascular_lesions": "Vascular Lesions",
                "benign_keratosis-like_lesions": "Benign Keratosis-like Lesions",
                "melanocytic_Nevi": "Melanocytic Nevi",
                "actinic_keratoses": "Actinic Keratoses"
            }
    }

const baseApiRoute = "https://api-inference.huggingface.co/models/";
const baseRequestInit : RequestInit =
    {
        headers: { Authorization : "Bearer " + process.env.HUGGING_FACE_AUTH },
        method: "POST"
    }

export async function scanImage(model: Model, image: File) : Promise<string | null>
{
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
    const labelToName = labels[model];

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