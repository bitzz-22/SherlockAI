import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateImageEmbedding(imageBuffer: ArrayBuffer): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const base64 = bufferToBase64(imageBuffer);
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64,
        },
      },
      "Describe this item in detail for matching purposes.",
    ]);

    const description = result.response.text();
    return await generateTextEmbedding(description);
  } catch (error) {
    console.error("Error generating image embedding:", error);
    throw new Error("Failed to generate image embedding");
  }
}

export async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating text embedding:", error);
    throw new Error("Failed to generate text embedding");
  }
}

export async function generateItemDescription(
  imageBuffer: ArrayBuffer,
  category: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const base64 = bufferToBase64(imageBuffer);
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64,
        },
      },
      `Describe this ${category} item in detail. Focus on: brand, color, size, distinguishing features, material, and any text or markings.`,
    ]);
    return result.response.text();
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate item description");
  }
}

export async function generateMatchReasoning(
  lostDescription: string,
  foundDescription: string,
  similarityScore: number
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Compare these two item descriptions and explain why they might be a match.

Lost item: ${lostDescription}
Found item: ${foundDescription}
Similarity score: ${(similarityScore * 100).toFixed(1)}%

Provide a brief, clear explanation (2-3 sentences) of the matching features, or note if they seem different.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating match reasoning:", error);
    return "Unable to generate match reasoning.";
  }
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
