import { ai, generationConfig } from '@/configs/AIModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { topic, imageStyle, duration } = await req.json();
        
        const prompt = `Write a script to generate ${duration} video on topic: ${topic} along with AI image prompt in ${imageStyle} format for each scene and give me the result in JSON format with imagePrompt and ContentText as field`;

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