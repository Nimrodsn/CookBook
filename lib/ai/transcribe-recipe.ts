import sharp from "sharp";
import { CATEGORY_IDS } from "@/lib/constants";
import {
  transcribedRecipeSchema,
  type TranscribedRecipeResponse,
} from "@/lib/validations/transcription";
import { AiError } from "./errors";
import { generateRecipeFromImage, RECIPE_PROMPT } from "./gemini-client";

const MAX_IMAGE_WIDTH = 1024;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const STRICT_RETRY_PROMPT = `${RECIPE_PROMPT}

IMPORTANT: Return ONLY raw JSON. No markdown, no code fences, no explanation.`;

export async function resizeRecipeImage(buffer: Buffer): Promise<{
  base64: string;
  mimeType: string;
}> {
  const resized = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  return {
    base64: resized.toString("base64"),
    mimeType: "image/jpeg",
  };
}

export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Image must be JPEG, PNG, or WebP.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be under 10 MB.";
  }
  return null;
}

function parseRecipeJson(raw: string): TranscribedRecipeResponse {
  let jsonStr = raw.trim();

  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new AiError(
      "Could not parse recipe from image. Try a clearer photo.",
      "invalid_response",
    );
  }

  const result = transcribedRecipeSchema.safeParse(parsed);

  if (!result.success) {
    throw new AiError(
      "Could not parse recipe from image. Try a clearer photo.",
      "invalid_response",
    );
  }

  const data = result.data;
  let warning: string | undefined;

  if (!data.ingredients && !data.instructions) {
    warning =
      "Could not read much text from this photo. Please fill in details manually.";
  }

  const category =
    data.category && CATEGORY_IDS.includes(data.category) ? data.category : null;

  return {
    title: data.title,
    ingredients: data.ingredients,
    instructions: data.instructions,
    category: category ?? undefined,
    tags: data.tags,
    warning,
  };
}

export async function transcribeRecipeImage(
  imageBuffer: Buffer,
): Promise<TranscribedRecipeResponse> {
  const { base64, mimeType } = await resizeRecipeImage(imageBuffer);

  try {
    const raw = await generateRecipeFromImage(base64, mimeType);
    return parseRecipeJson(raw);
  } catch (firstError) {
    if (
      firstError instanceof AiError &&
      firstError.code !== "invalid_response"
    ) {
      throw firstError;
    }

    const raw = await generateRecipeFromImage(
      base64,
      mimeType,
      STRICT_RETRY_PROMPT,
    );
    return parseRecipeJson(raw);
  }
}
