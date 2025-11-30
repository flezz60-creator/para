import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API Key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ImageGenerationOptions {
  aspectRatio?: "1:1" | "16:9" | "4:3" | "3:4";
}

/**
 * Generates an image based on a text prompt using the 'nanobanana' model (gemini-2.5-flash-image).
 */
export const generateDreamImage = async (prompt: string, options: ImageGenerationOptions = {}): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: options.aspectRatio || "16:9", 
        }
      },
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          // Construct the data URL
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};