"use client"
import { useState } from "react";
import { toast } from "react-hot-toast";
import * as tf from "@tensorflow/tfjs";
import cv from "@techstark/opencv-js";

export default function Page()
{
    const [image, setImage] = useState(null);

    //@ts-ignore
    const imageUploaded = (e) =>
    {
        setImage(e.target.files[0]);
    }

    const detect = async () => 
    {
        if(image == null)
        {
            toast.error("Upload an image first");
        }
        const model = await tf.loadLayersModel("models/converted_categorical/model.json");
    }
    return <div className="container mx-auto flex flex-col gap-10">
        <div className="flex justify-center items-center gap-4">
            <h1 className="text-2xl font-semibold">Detector</h1>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
            <label htmlFor="image-to-scan" className="cursor-pointer font-semibold">Upload MRI Scan</label>
            <label htmlFor="image-to-scan" className="bg-gray-800 rounded-md cursor-pointer w-[300px] h-[300px] flex justify-center items-center hover:brightness-125">
                {
                    image ?
                    <img src={URL.createObjectURL(image)} alt="MRI Scan" className="rounded-md"/>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="currentColor" viewBox="0 -960 960 960">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
                    </svg>
                }
            </label>
            <input className="hidden" id="image-to-scan" type="file" accept="image/*" onChange={imageUploaded}/>
            <button className="rounded-full px-7 py-3 m-5 bg-indigo-400 font-semibold hover:bg-indigo-300" onClick={detect}>Detect</button>
        </div>
    </div>
}

async function cropImage(image: File)
{
    const fileReader = new FileReader();
    fileReader.onload = () =>
    {};
    fileReader.readAsArrayBuffer(image);
}