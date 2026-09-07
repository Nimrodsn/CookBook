"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createRecipe, deleteRecipe, updateRecipe } from "@/lib/appwrite/recipes";
import {
  getCategories,
  getCategorySlugs,
} from "@/lib/appwrite/categories";
import {
  deleteRecipeImage,
  uploadRecipeImages,
} from "@/lib/appwrite/storage";
import {
  assertMaxImages,
  parseExternalImageUrls,
  parseKeptImagesFromFormData,
  parseNewImageFiles,
  parseRemovedFileIds,
  syncLegacyPrimaryFields,
  validateRecipeUploadFile,
} from "@/lib/recipe-images";
import { parseTagsInput } from "@/lib/utils";
import {
  externalRecipeSchema,
  localRecipeSchema,
  validateCategorySlug,
} from "@/lib/validations/recipe";
import { debugLog } from "@/lib/debug-log";

export type ActionState = {
  error?: string;
  success?: boolean;
};

async function buildLocalImagesFromFormData(formData: FormData): Promise<
  | { error: string }
  | {
      imageFields: ReturnType<typeof syncLegacyPrimaryFields>;
    }
> {
  const kept = parseKeptImagesFromFormData(formData);
  const newFiles = parseNewImageFiles(formData);
  const rawImages = formData.getAll("images");

  // #region agent log
  debugLog({
    runId: "pre-fix",
    hypothesisId: "B,E",
    location: "recipes.ts:buildLocalImagesFromFormData",
    message: "parsed form image data",
    data: {
      keptCount: kept.length,
      keptUrls: kept.map((i) => i.url?.slice(0, 80)),
      keptFileIds: kept.map((i) => i.fileId),
      rawImagesCount: rawImages.length,
      rawImageTypes: rawImages.map((f) =>
        f && typeof f === "object"
          ? `${(f as { constructor?: { name?: string } }).constructor?.name ?? "unknown"}:${(f as { size?: number }).size ?? "na"}:${(f as { type?: string }).type ?? "na"}`
          : String(typeof f),
      ),
      newFilesCount: newFiles.length,
      newFileNames: newFiles.map((f) => f.name),
      newFileTypes: newFiles.map((f) => f.type),
    },
  });
  // #endregion

  for (const file of newFiles) {
    const validationError = validateRecipeUploadFile(file);
    if (validationError) {
      return { error: validationError };
    }
  }

  const maxError = assertMaxImages(kept.length + newFiles.length);
  if (maxError) {
    return { error: maxError };
  }

  const urls = kept.map((image) => image.url);
  const fileIds = kept.map((image) => image.fileId);

  if (newFiles.length > 0) {
    try {
      const uploaded = await uploadRecipeImages(newFiles);
      for (const item of uploaded) {
        urls.push(item.previewUrl);
        fileIds.push(item.fileId);
      }
      // #region agent log
      debugLog({
        runId: "pre-fix",
        hypothesisId: "C",
        location: "recipes.ts:buildLocalImagesFromFormData:uploaded",
        message: "upload succeeded",
        data: {
          uploadedCount: uploaded.length,
          fileIds: uploaded.map((u) => u.fileId),
        },
      });
      // #endregion
    } catch (uploadError) {
      // #region agent log
      debugLog({
        runId: "pre-fix",
        hypothesisId: "C",
        location: "recipes.ts:buildLocalImagesFromFormData:uploadError",
        message: "upload failed",
        data: {
          error:
            uploadError instanceof Error
              ? uploadError.message
              : String(uploadError),
        },
      });
      // #endregion
      return { error: "Failed to upload image" };
    }
  }

  const imageFields = syncLegacyPrimaryFields(urls, fileIds);
  // #region agent log
  debugLog({
    runId: "pre-fix",
    hypothesisId: "E",
    location: "recipes.ts:buildLocalImagesFromFormData:result",
    message: "final image fields",
    data: {
      urlCount: imageFields.image_urls.length,
      fileIdCount: imageFields.image_file_ids.length,
      primaryUrl: imageFields.image_url?.slice(0, 80) ?? null,
      primaryFileId: imageFields.image_file_id,
    },
  });
  // #endregion

  return { imageFields };
}

async function validateRecipeCategory(category: string): Promise<string | null> {
  const categories = await getCategories();
  return validateCategorySlug(category, getCategorySlugs(categories));
}

export async function createLocalRecipe(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = localRecipeSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    ingredients: formData.get("ingredients") || undefined,
    instructions: formData.get("instructions") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const categoryError = await validateRecipeCategory(parsed.data.category);
  if (categoryError) {
    return { error: categoryError };
  }

  const imageResult = await buildLocalImagesFromFormData(formData);
  if ("error" in imageResult) {
    return { error: imageResult.error };
  }

  try {
    await createRecipe({
      title: parsed.data.title,
      type: "local",
      category: parsed.data.category,
      tags: parsed.data.tags,
      ingredients: parsed.data.ingredients ?? null,
      instructions: parsed.data.instructions ?? null,
      image_url: imageResult.imageFields.image_url,
      image_file_id: imageResult.imageFields.image_file_id,
      image_urls: imageResult.imageFields.image_urls,
      image_file_ids: imageResult.imageFields.image_file_ids,
      url: null,
      custom_notes: null,
    });
  } catch {
    return { error: "Failed to save recipe. Check Appwrite configuration." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function createExternalRecipe(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const imageUrls = parseExternalImageUrls(formData);

  const parsed = externalRecipeSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    image_urls: imageUrls,
    category: formData.get("category"),
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    custom_notes: formData.get("custom_notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const categoryError = await validateRecipeCategory(parsed.data.category);
  if (categoryError) {
    return { error: categoryError };
  }

  const imageFields = syncLegacyPrimaryFields(
    parsed.data.image_urls,
    parsed.data.image_urls.map(() => null),
  );

  try {
    await createRecipe({
      title: parsed.data.title,
      type: "external",
      url: parsed.data.url,
      image_url: imageFields.image_url,
      image_file_id: null,
      image_urls: imageFields.image_urls,
      image_file_ids: imageFields.image_file_ids,
      category: parsed.data.category,
      tags: parsed.data.tags,
      custom_notes: parsed.data.custom_notes ?? null,
      ingredients: null,
      instructions: null,
    });
  } catch {
    return { error: "Failed to save recipe. Check Appwrite configuration." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function updateLocalRecipe(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = localRecipeSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    ingredients: formData.get("ingredients") || undefined,
    instructions: formData.get("instructions") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const categoryError = await validateRecipeCategory(parsed.data.category);
  if (categoryError) {
    return { error: categoryError };
  }

  for (const fileId of parseRemovedFileIds(formData)) {
    await deleteRecipeImage(fileId);
  }

  const imageResult = await buildLocalImagesFromFormData(formData);
  if ("error" in imageResult) {
    return { error: imageResult.error };
  }

  try {
    await updateRecipe(id, {
      title: parsed.data.title,
      category: parsed.data.category,
      tags: parsed.data.tags,
      ingredients: parsed.data.ingredients ?? null,
      instructions: parsed.data.instructions ?? null,
      image_url: imageResult.imageFields.image_url,
      image_file_id: imageResult.imageFields.image_file_id,
      image_urls: imageResult.imageFields.image_urls,
      image_file_ids: imageResult.imageFields.image_file_ids,
    });
  } catch {
    return { error: "Failed to update recipe" };
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
  redirect(`/recipes/${id}`);
}

export async function updateExternalRecipe(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const imageUrls = parseExternalImageUrls(formData);

  const parsed = externalRecipeSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    image_urls: imageUrls,
    category: formData.get("category"),
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    custom_notes: formData.get("custom_notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const categoryError = await validateRecipeCategory(parsed.data.category);
  if (categoryError) {
    return { error: categoryError };
  }

  const imageFields = syncLegacyPrimaryFields(
    parsed.data.image_urls,
    parsed.data.image_urls.map(() => null),
  );

  try {
    await updateRecipe(id, {
      title: parsed.data.title,
      url: parsed.data.url,
      image_url: imageFields.image_url,
      image_file_id: null,
      image_urls: imageFields.image_urls,
      image_file_ids: imageFields.image_file_ids,
      category: parsed.data.category,
      tags: parsed.data.tags,
      custom_notes: parsed.data.custom_notes ?? null,
    });
  } catch {
    return { error: "Failed to update recipe" };
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${id}`);
  redirect(`/recipes/${id}`);
}

export async function removeRecipe(id: string) {
  try {
    await deleteRecipe(id);
  } catch {
    return { error: "Failed to delete recipe" };
  }

  revalidatePath("/");
  redirect("/");
}
