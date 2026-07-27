// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

// Import other required libraries
const fs = require('fs');
const util = require('util');



const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {

    // The text to synthesize
    const { text, id } = await req.json();


    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };


    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);

    // ADD THIS LINE to actually save the file! 
    // We will use the 'id' you passed in to name the file (e.g., 12345.mp3)
    await writeFile(id + '.mp3', response.audioContent, 'binary');

    return NextResponse.json({Result: 'Success'});
}
