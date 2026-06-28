import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiError } from "./errors";

const DEFAULT_MODEL = "gemini-2.0-flash";
const REQUEST_TIMEOUT_MS = 60_000;

export const RECIPE_PROMPT = `You are a recipe transcription assistant. Read this image of a recipe (handwritten or printed, in any language including Hebrew).

Extract the recipe and respond with ONLY valid JSON in this exact shape:
{
  "title": "recipe name",
  "ingredients": "one ingredient per line",
  "instructions": "one step per line",
  "category": "one of: meat, vegetarian, dessert, gluten_free, dairy, salad — or null if unsure",
  "tags": ["optional", "short", "tags"]
}

Rules:
- Preserve the original language (Hebrew, English, or mixed).
- Use \\n for line breaks inside ingredients and instructions strings.
- If text is unclear, do your best and do not invent ingredients.
- category must be exactly one of the enum values or null.`;

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new AiError(
      "AI scanning is not configured. Add GEMINI_API_KEY to your environment.",
      "not_configured",
    );
  }
  return key;
}

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export async function generateRecipeFromImage(
  base64: string,
  mimeType: string,
  prompt: string = RECIPE_PROMPT,
): Promise<string> {
  const apiKey = getGeminiApiKey();
  const modelName = getGeminiModel();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new AiError(
          "AI request timed out. Try a smaller or clearer photo.",
          "timeout",
        ),
      );
    }, REQUEST_TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([
      model.generateContent([
        prompt,
        { inlineData: { data: base64, mimeType } },
      ]),
      timeout,
    ]);

    const text = result.response.text();
    if (!text) {
      throw new AiError(
        "Could not parse recipe from image. Try a clearer photo.",
        "invalid_response",
      );
    }

    return text;
  } catch (error) {
    if (error instanceof AiError) throw error;

    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
      throw new AiError("AI quota exceeded — try again later.", "quota_exceeded");
    }
    if (
      msg.toLowerCase().includes("api key") ||
      msg.includes("API_KEY_INVALID") ||
      msg.includes("401")
    ) {
      throw new AiError(
        "Invalid Gemini API key. Check GEMINI_API_KEY in your environment.",
        "invalid_key",
      );
    }

    throw new AiError(
      "Could not parse recipe from image. Try a clearer photo.",
      "invalid_response",
    );
  }
}
