import { NextResponse } from "next/server";
import { getAiErrorMessage } from "@/lib/ai/errors";
import {
  transcribeRecipeImage,
  validateImageFile,
} from "@/lib/ai/transcribe-recipe";
import { transcribedRecipeResponseSchema } from "@/lib/validations/transcription";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { error: "An image file is required." },
        { status: 400 },
      );
    }

    const validationError = validateImageFile(image);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const result = await transcribeRecipeImage(buffer);
    const parsed = transcribedRecipeResponseSchema.safeParse(result);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Failed to validate transcribed recipe." },
        { status: 500 },
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    const message = getAiErrorMessage(error);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
