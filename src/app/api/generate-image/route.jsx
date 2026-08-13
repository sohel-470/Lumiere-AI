import { storage } from '@/configs/FirebaseConfig';
import { GoogleGenAI } from '@google/genai';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { NextResponse } from 'next/server';


// 1. Initialize with Enterprise mode to use your existing Service Account
const ai = new GoogleGenAI({
    enterprise: true, // Tells the SDK to use Application Default Credentials(ADC): NO API KEY REQUIRED!
    project: process.env.GOOGLE_CLOUD_PROJECT_ID, // My specific project ID with free credits
    location: 'global',
});

const model = 'gemini-3.1-flash-image';


const generationConfig = {
    responseModalities: ["IMAGE"],
    imageConfig: {
        aspectRatio: "9:16",
        imageSize: "512",
        outputMimeType: "image/png",
        personGeneration: "allow_all", // Added to bypass the adult-only filter
    },
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' }
    ],
};


export async function POST(req) {

    try {

        const { prompt } = await req.json();

        // 4. TEST: Log the incoming prompt so you can see if it's undefined
        console.log("Incoming Prompt:", prompt);

        // 5. TEST: Temporarily force a 100% safe prompt to bypass the Scary Story horror filter
        const safeTestPrompt = "A cinematic, highly detailed photograph of a cute fluffy golden retriever puppy playing in a bright green sunny park.";

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,  // Using the hardcoded prompt for this test
            config: generationConfig,
        });

        // 3. Extract the base64 string from the nested response payload
        const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Data) {
            return NextResponse.json({ error: "No image data returned" }, { status: 500 });
        }

        //Save to FireBase
        const fileName = `lumiere-ai-files/${Date.now()}.png`
        const storageRef = ref(storage, fileName)

        // Upload the Base64 image to Firebase Storage; 'base64' tells Firebase how to decode the data,
        // and contentType specifies that the resulting file is a PNG image.
        await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/png' });

        //get download url from firebase
        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl)

        // 5. Return JSON to match what your frontend expects: { result: "..." }
        return NextResponse.json({ result: downloadUrl });

    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}