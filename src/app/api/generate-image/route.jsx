import { storage } from '@/configs/FirebaseConfig';
import { GoogleGenAI } from '@google/genai';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
    enterprise: true,
    project: process.env.GOOGLE_CLOUD_PROJECT_ID,
    location: 'global',
});

const model = 'gemini-3.1-flash-image';

export async function POST(req) {
    try {
        const { prompt, aspectRatio = '9:16' } = await req.json();

        const generationConfig = {
            responseModalities: ["IMAGE"],
            imageConfig: {
                // Accepts "9:16" or "16:9" dynamically
                aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16',
                imageSize: "512",
                outputMimeType: "image/png",
                personGeneration: "allow_all",
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' }
            ],
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: generationConfig,
        });

        const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Data) {
            return NextResponse.json({ error: "No image data returned" }, { status: 500 });
        }

        const fileName = `lumiere-ai-files/${Date.now()}.png`;
        const storageRef = ref(storage, fileName);
        await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/png' });

        const downloadUrl = await getDownloadURL(storageRef);
        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}