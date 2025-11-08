import { GoogleGenAI, Chat, Modality, Content } from '@google/genai';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const startChatSession = (history?: Content[]): Chat => {
  const model = 'gemini-2.5-flash';
  return ai.chats.create({
    model,
    history,
    config: {
        systemInstruction: `You are SUNCO AI, a powerful, friendly, and helpful multimodal AI assistant. 
        - Your responses should be informative, friendly, and engaging.
        - You can process text, images, and various file types.
        - When generating images, use the phrase "Here is the image you requested:"
        - When editing images, use the phrase "Here is the edited image:"
        - When analyzing files, provide concise summaries or answer specific questions about the content.`,
    },
  });
};

export const generateImage = async (prompt: string) => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    return response.generatedImages[0].image.imageBytes;
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            { text: prompt },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error('No image was edited or returned.');
};
