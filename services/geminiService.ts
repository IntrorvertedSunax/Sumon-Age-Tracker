import { GoogleGenAI } from "@google/genai";

// Initialize the client. 
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAgeInsight = async (years: number, months: number): Promise<string> => {
  try {
    const prompt = `
      The user is exactly ${years} years and ${months} months old. 
      Give me a short, fascinating, positive fact or "stat" related to this specific age. 
      It could be biological (what happens to the body), historical (what a famous person did at this age), or statistical.
      Keep it under 2 sentences. Be witty and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "You are unique in the universe!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Time flies when you're having fun!";
  }
};