import { ID, Query } from "node-appwrite";
import type { Recipe, RecipeInput } from "@/lib/types";
import { getAllRecipeFileIds } from "@/lib/utils";
import { syncLegacyPrimaryFields } from "@/lib/recipe-images";
import { deleteRecipeImage } from "./storage";
import {
  DB_ID,
  RECIPES_COL,
  databases,
  isAppwriteConfigured,
} from "./server";

function mapDocument(doc: Record<string, unknown>): Recipe {
  const imageUrls = (doc.image_urls as string[] | undefined) ?? [];
  const imageFileIds = (doc.image_file_ids as string[] | undefined) ?? [];
  const legacyUrl = (doc.image_url as string | null) ?? null;
  const legacyFileId = (doc.image_file_id as string | null) ?? null;

  const resolvedUrls =
    imageUrls.length > 0 ? imageUrls : legacyUrl ? [legacyUrl] : [];
  const resolvedFileIds =
    imageUrls.length > 0
      ? imageFileIds
      : legacyFileId
        ? [legacyFileId]
        : [];

  return {
    $id: doc.$id as string,
    $createdAt: doc.$createdAt as string,
    $updatedAt: doc.$updatedAt as string,
    title: doc.title as string,
    type: doc.type as Recipe["type"],
    url: (doc.url as string | null) ?? null,
    image_url: resolvedUrls[0] ?? null,
    image_file_id: resolvedFileIds[0] ?? null,
    image_urls: resolvedUrls,
    image_file_ids: resolvedFileIds,
    category: (doc.category as string | null) ?? "",
    tags: (doc.tags as string[]) ?? [],
    ingredients: (doc.ingredients as string | null) ?? null,
    instructions: (doc.instructions as string | null) ?? null,
    custom_notes: (doc.custom_notes as string | null) ?? null,
  };
}

function withSyncedImageFields(
  data: Partial<RecipeInput>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...data };

  if (data.image_urls !== undefined) {
    const fileIds = data.image_file_ids ?? data.image_urls.map(() => "");
    const synced = syncLegacyPrimaryFields(data.image_urls, fileIds);
    payload.image_url = synced.image_url;
    payload.image_file_id = synced.image_file_id;
    payload.image_urls = synced.image_urls;
    payload.image_file_ids = synced.image_file_ids;
  }

  return payload;
}

export async function getRecipes(): Promise<Recipe[]> {
  if (!isAppwriteConfigured()) return [];

  const response = await databases.listDocuments(DB_ID, RECIPES_COL, [
    Query.orderDesc("$createdAt"),
    Query.limit(500),
  ]);

  return response.documents.map((doc) =>
    mapDocument(doc as unknown as Record<string, unknown>),
  );
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  if (!isAppwriteConfigured()) return null;

  try {
    const doc = await databases.getDocument(DB_ID, RECIPES_COL, id);
    return mapDocument(doc as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function createRecipe(data: RecipeInput): Promise<Recipe> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const doc = await databases.createDocument(
    DB_ID,
    RECIPES_COL,
    ID.unique(),
    withSyncedImageFields({
      title: data.title,
      type: data.type,
      url: data.url ?? null,
      image_url: data.image_url ?? null,
      image_file_id: data.image_file_id ?? null,
      image_urls: data.image_urls ?? [],
      image_file_ids: data.image_file_ids ?? [],
      category: data.category,
      tags: data.tags ?? [],
      ingredients: data.ingredients ?? null,
      instructions: data.instructions ?? null,
      custom_notes: data.custom_notes ?? null,
    }),
  );

  return mapDocument(doc as unknown as Record<string, unknown>);
}

export async function updateRecipe(
  id: string,
  data: Partial<RecipeInput>,
): Promise<Recipe> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const doc = await databases.updateDocument(
    DB_ID,
    RECIPES_COL,
    id,
    withSyncedImageFields(data),
  );
  return mapDocument(doc as unknown as Record<string, unknown>);
}

export async function deleteRecipe(id: string): Promise<void> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const recipe = await getRecipe(id);
  if (recipe) {
    for (const fileId of getAllRecipeFileIds(recipe)) {
      await deleteRecipeImage(fileId);
    }
  }

  await databases.deleteDocument(DB_ID, RECIPES_COL, id);
}
