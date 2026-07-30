import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';


// 1. Initialize with Enterprise mode to use your existing Service Account
const ai = new GoogleGenAI({
    enterprise: true, // Tells the SDK to use Application Default Credentials(ADC): NO API KEY REQUIRED!
    project: process.env.GOOGLE_CLOUD_PROJECT_ID, // My specific project ID with free credits
    location: 'global',
});

const model = 'gemini-3.1-flash-image';


const generationConfig = {
    maxOutputTokens: 32768,
    temperature: 1,
    topP: 0.95,
    responseModalities: ["IMAGE"],
    thinkingConfig: {
        thinkingLevel: "MINIMAL",
    },
    imageConfig: {
        aspectRatio: "9:16",
        imageSize: "1K",
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
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: generationConfig,
        });

        // 3. Extract the base64 string from the nested response payload
        const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Data) {
            return NextResponse.json({ error: "No image data returned" }, { status: 500 });
        }

        // 4. Format as a Data URL so frontend handles it like a regular image URL
        const imageUrl = `data:image/png;base64,${base64Data}`;

        // 5. Return JSON to match what your frontend expects: { result: "..." }
        return NextResponse.json({ result: imageUrl });

    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}