
import { GoogleGenAI, Type } from "@google/genai";
import type { Pitch } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const pitchSchema = {
    type: Type.OBJECT,
    properties: {
        elevatorPitch: { 
            type: Type.STRING, 
            description: "A concise and compelling summary of the business, 2-3 sentences max." 
        },
        problem: { 
            type: Type.STRING, 
            description: "Clearly define the pain point or need this idea addresses for a specific audience." 
        },
        solution: { 
            type: Type.STRING, 
            description: "Describe the product or service and exactly how it solves the identified problem." 
        },
        targetMarket: { 
            type: Type.STRING, 
            description: "Identify the primary customer segment, including demographics and psychographics." 
        },
        usp: { 
            type: Type.STRING, 
            description: "Explain the Unique Selling Proposition. What makes this idea stand out from existing competitors?" 
        },
        monetization: { 
            type: Type.STRING, 
            description: "Outline the primary revenue streams (e.g., subscription, one-time purchase, ad revenue)." 
        },
    },
    required: ["elevatorPitch", "problem", "solution", "targetMarket", "usp", "monetization"]
};


export const generatePitch = async (idea: string): Promise<Pitch> => {
  try {
    const prompt = `
      You are an expert business consultant and startup mentor. 
      Generate a comprehensive and compelling business pitch for the following idea: "${idea}".
      Your response must be structured as a JSON object matching the provided schema.
      Be creative, insightful, and professional. The tone should be persuasive and confident.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: pitchSchema,
            temperature: 0.7,
        }
    });

    const jsonText = response.text.trim();
    const parsedPitch: Pitch = JSON.parse(jsonText);
    return parsedPitch;

  } catch (error) {
    console.error("Error generating pitch:", error);
    throw new Error("Failed to generate pitch. The AI model may be temporarily unavailable.");
  }
};
