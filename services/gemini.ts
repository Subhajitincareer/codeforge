import { GoogleGenAI } from "@google/genai";

// Initialize the client
// Using process.env.API_KEY as strictly required by the instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates JSON data based on a natural language prompt.
 * Uses the responseMimeType: 'application/json' for strict JSON output.
 */
export const generateJsonData = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: `
          You are a Senior Backend Engineer and Data Architect. 
          Your goal is to generate high-quality, realistic, and edge-case-aware mock data in JSON format for testing software.
          
          Rules:
          1. Return ONLY valid JSON.
          2. Do not wrap the output in markdown code blocks (e.g. \`\`\`json).
          3. Ensure IDs are unique.
          4. Use realistic data (names, dates, descriptions).
          5. If image URLs are needed, use "https://picsum.photos/seed/{random}/200/200".
          6. Respect the user's requested count/quantity strictly.
        `,
        // We use a decent temperature to ensure variety in the mock data
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }
    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};