import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {
        const baseUrl = "https://api.assemblyai.com";
        const { audioFileUrl } = await req.json()

        const client = new AssemblyAI({
            apiKey: process.env.CAPTION_API,
            baseUrl: baseUrl,
        });

        // Use a publicly-accessible URL
        const audioFile = audioFileUrl;

        // Or use a local file:
        // const audioFile = "./example.mp3";

        const params = {
            audio: audioFile,
            language_detection: true,
            speaker_labels: true,
        };

        const transcript = await client.transcripts.transcribe(params);

        if (transcript.status === "error") {
            throw new Error(`Transcription failed: ${transcript.error}`);
        }

        // Log transcript.id for every request (not just errors), with a timestamp and API region.
        // It's required to fetch results, retry, or delete the transcript later, and it's the first
        // thing support@assemblyai.com asks for. Delete: /pre-recorded-audio/delete-transcripts
        // Troubleshooting: /pre-recorded-audio/guides/common_errors_and_solutions

        console.log(`\nFull Transcript:\n\n${transcript.text}`);
        console.log(transcript.words);

        return NextResponse.json({ 'result': transcript.words });

        // Optionally print speaker diarization results
        // for (const utterance of transcript.utterances) {
        //   console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
        // }
    } catch (e) {
        return NextResponse.json({ 'error': e });
    }

}