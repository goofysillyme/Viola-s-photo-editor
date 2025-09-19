
import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        const [header, data] = result.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const editImage = async (imageFile: File, prompt: string): Promise<{ data: string; mimeType: string } | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { mimeType, data: base64ImageData } = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // The response is complex, we need to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return {
              data: part.inlineData.data,
              mimeType: part.inlineData.mimeType,
            };
          }
        }
      }
    }
    
    // If no image part is found in the response
    return null;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the AI model. Please check your prompt or try again later.");
  }
};
