import { GoogleGenAI } from '@google/genai';

export const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export const generationConfig = {
    temperature: 0.7, // Slightly lowered from 1 for more consistent JSON structure
    maxOutputTokens: 8192, 
    topP: 0.95,
    responseMimeType: "application/json" // The strict JSON enforcer
};