import sharp from "sharp";
import {
  getCategories,
  getCategorySlugs,
  seedDefaultCategories,
} from "@/lib/appwrite/categories";
import {
  transcribedRecipeSchema,
  type TranscribedRecipeResponse,
} from "@/lib/validations/transcription";
import { AiError } from "./errors";
import { buildRecipePrompt, generateRecipeFromImage } from "./gemini-client";

const MAX_IMAGE_WIDTH = 1024;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

async function getRecipePrompt(): Promise<string> {
  await seedDefaultCategories();
  const categories = await getCategories();
  return buildRecipePrompt(getCategorySlugs(categories));
}

function parseRecipeJson(
  raw: string,
  allowedSlugs: string[],
): TranscribedRecipeResponse {
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
    data.category && allowedSlugs.includes(data.category) ? data.category : null;

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
  const prompt = await getRecipePrompt();
  const allowedSlugs = getCategorySlugs(await getCategories());
  const strictRetryPrompt = `${prompt}

IMPORTANT: Return ONLY raw JSON. No markdown, no code fences, no explanation.`;

  try {
    const raw = await generateRecipeFromImage(base64, mimeType, prompt);
    return parseRecipeJson(raw, allowedSlugs);
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
      strictRetryPrompt,
    );
    return parseRecipeJson(raw, allowedSlugs);
  }
}
