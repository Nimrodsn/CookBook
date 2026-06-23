"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createRecipe, deleteRecipe, updateRecipe } from "@/lib/appwrite/recipes";
import { uploadRecipeImage, deleteRecipeImage } from "@/lib/appwrite/storage";
import type { CategoryId } from "@/lib/constants";
import { parseTagsInput } from "@/lib/utils";
import {
  externalRecipeSchema,
  localRecipeSchema,
} from "@/lib/validations/recipe";

export type ActionState = {
  error?: string;
  success?: boolean;
};

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

  let imageUrl: string | null = null;
  let imageFileId: string | null = null;

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    try {
      const uploaded = await uploadRecipeImage(image);
      imageUrl = uploaded.previewUrl;
      imageFileId = uploaded.fileId;
    } catch {
      return { error: "Failed to upload image" };
    }
  }

  try {
    await createRecipe({
      title: parsed.data.title,
      type: "local",
      category: parsed.data.category as CategoryId,
      tags: parsed.data.tags,
      ingredients: parsed.data.ingredients ?? null,
      instructions: parsed.data.instructions ?? null,
      image_url: imageUrl,
      image_file_id: imageFileId,
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
  const parsed = externalRecipeSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    image_url: formData.get("image_url") || undefined,
    category: formData.get("category"),
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    custom_notes: formData.get("custom_notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await createRecipe({
      title: parsed.data.title,
      type: "external",
      url: parsed.data.url,
      image_url: parsed.data.image_url || null,
      category: parsed.data.category as CategoryId,
      tags: parsed.data.tags,
      custom_notes: parsed.data.custom_notes ?? null,
      image_file_id: null,
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

  const updates: Record<string, unknown> = {
    title: parsed.data.title,
    category: parsed.data.category,
    tags: parsed.data.tags,
    ingredients: parsed.data.ingredients ?? null,
    instructions: parsed.data.instructions ?? null,
  };

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    try {
      const uploaded = await uploadRecipeImage(image);
      updates.image_url = uploaded.previewUrl;
      updates.image_file_id = uploaded.fileId;
    } catch {
      return { error: "Failed to upload image" };
    }
  }

  try {
    await updateRecipe(id, updates);
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
  const parsed = externalRecipeSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    image_url: formData.get("image_url") || undefined,
    category: formData.get("category"),
    tags: parseTagsInput(String(formData.get("tags") ?? "")),
    custom_notes: formData.get("custom_notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await updateRecipe(id, {
      title: parsed.data.title,
      url: parsed.data.url,
      image_url: parsed.data.image_url || null,
      category: parsed.data.category as CategoryId,
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

export async function removeRecipe(id: string, imageFileId?: string | null) {
  try {
    if (imageFileId) {
      await deleteRecipeImage(imageFileId);
    }
    await deleteRecipe(id);
  } catch {
    return { error: "Failed to delete recipe" };
  }

  revalidatePath("/");
  redirect("/");
}
