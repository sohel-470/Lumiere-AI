import { ai, generationConfig } from '@/configs/AIModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { topic, imageStyle, duration } = await req.json();

        const prompt = `Write a script to generate a ${duration} video on the topic: ${topic}. 
CRITICAL INSTRUCTION: You are a creative adapter. If the topic involves copyrighted, trademarked, or licensed intellectual property (e.g., Marvel, Disney, movies, anime, real celebrities), you MUST NOT use their actual names in the imagePrompt. 
Instead, intelligently invent a highly detailed, generic, but visually similar equivalent that captures the exact same cinematic vibe without triggering copyright filters (e.g., instead of 'Spider-Man', use 'a nimble, masked vigilante in a high-tech red and blue athletic suit swinging through a glowing neon metropolis'). 
NEVER return an error or leave a prompt empty. Always adapt and deliver a complete, safe JSON response. Give me the result in JSON format with 'imagePrompt' and 'ContentText' as fields for each scene.`;

        // Using standard generateContent method and stable model
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: generationConfig,
        });

        const resultText = response.text;

        const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '');

        let parsedResult;
        try {
            parsedResult = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parsing Error. Raw output:", resultText);
            return NextResponse.json({ error: "Failed to generate valid JSON format" }, { status: 500 });
        }

        return NextResponse.json({
            result: parsedResult,
            debugPrompt: prompt
        });

    } catch (error) {
        // This will print the exact reason for the failure in your Next.js terminal
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}