import { ID, Query } from "node-appwrite";
import type { Recipe, RecipeInput } from "@/lib/types";
import { deleteRecipeImage } from "./storage";
import {
  DB_ID,
  RECIPES_COL,
  databases,
  isAppwriteConfigured,
} from "./server";

function mapDocument(doc: Record<string, unknown>): Recipe {
  return {
    $id: doc.$id as string,
    $createdAt: doc.$createdAt as string,
    $updatedAt: doc.$updatedAt as string,
    title: doc.title as string,
    type: doc.type as Recipe["type"],
    url: (doc.url as string | null) ?? null,
    image_url: (doc.image_url as string | null) ?? null,
    image_file_id: (doc.image_file_id as string | null) ?? null,
    category: doc.category as Recipe["category"],
    tags: (doc.tags as string[]) ?? [],
    ingredients: (doc.ingredients as string | null) ?? null,
    instructions: (doc.instructions as string | null) ?? null,
    custom_notes: (doc.custom_notes as string | null) ?? null,
  };
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
    {
      title: data.title,
      type: data.type,
      url: data.url ?? null,
      image_url: data.image_url ?? null,
      image_file_id: data.image_file_id ?? null,
      category: data.category,
      tags: data.tags ?? [],
      ingredients: data.ingredients ?? null,
      instructions: data.instructions ?? null,
      custom_notes: data.custom_notes ?? null,
    },
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

  const doc = await databases.updateDocument(DB_ID, RECIPES_COL, id, data);
  return mapDocument(doc as unknown as Record<string, unknown>);
}

export async function deleteRecipe(id: string): Promise<void> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const recipe = await getRecipe(id);
  if (recipe?.image_file_id) {
    await deleteRecipeImage(recipe.image_file_id);
  }

  await databases.deleteDocument(DB_ID, RECIPES_COL, id);
}
