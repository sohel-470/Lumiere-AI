// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech';
import { storage } from '@/configs/FirebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { NextResponse } from 'next/server';

// Initialize client outside the handler so it can be reused across warm requests
const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
    try {
        // Parse the request body
        const { text, id } = await req.json();

        // 1. Validate Input
        if (!text || !id) {
            return NextResponse.json(
                { error: "Missing required fields: 'text' or 'id'." },
                { status: 400 }
            );
        }

        const storageref = ref(storage, `lumiere-ai-files/${id}.mp3`);

        // Construct the TTS request
        const request = {
            input: { text: text },
            voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        // 2. Upload directly to Firebase (audioContent is already a Uint8Array)
        await uploadBytes(storageref, response.audioContent, {
            contentType: 'audio/mp3'
        });

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageref);

        console.log(downloadUrl)
        return NextResponse.json({ Result: downloadUrl });

    } catch (error) {
        // 3. Proper Error Handling
        console.error("Error generating or uploading speech:", error);
        return NextResponse.json(
            { error: "Failed to process text-to-speech request." },
            { status: 500 }
        );
    }
}