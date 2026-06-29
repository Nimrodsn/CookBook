import { ID, Query } from "node-appwrite";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/types";
import {
  CATEGORIES_COL,
  DB_ID,
  RECIPES_COL,
  databases,
  isAppwriteConfigured,
} from "./server";

function mapCategory(doc: Record<string, unknown>): Category {
  return {
    $id: doc.$id as string,
    slug: doc.slug as string,
    label_en: doc.label_en as string,
    label_he: doc.label_he as string,
    sort_order: (doc.sort_order as number) ?? 0,
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!isAppwriteConfigured()) return [];

  const response = await databases.listDocuments(DB_ID, CATEGORIES_COL, [
    Query.limit(100),
  ]);

  const categories = response.documents.map((doc) =>
    mapCategory(doc as unknown as Record<string, unknown>),
  );

  return categories.sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.label_en.localeCompare(b.label_en);
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isAppwriteConfigured()) return null;

  try {
    const doc = await databases.getDocument(DB_ID, CATEGORIES_COL, slug);
    return mapCategory(doc as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function createCategory(data: {
  slug: string;
  label_en: string;
  label_he: string;
  sort_order?: number;
}): Promise<Category> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const doc = await databases.createDocument(
    DB_ID,
    CATEGORIES_COL,
    data.slug,
    {
      slug: data.slug,
      label_en: data.label_en,
      label_he: data.label_he,
      sort_order: data.sort_order ?? 0,
    },
  );

  return mapCategory(doc as unknown as Record<string, unknown>);
}

export async function updateCategory(
  slug: string,
  data: { label_en: string; label_he: string },
): Promise<Category> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const doc = await databases.updateDocument(DB_ID, CATEGORIES_COL, slug, {
    label_en: data.label_en,
    label_he: data.label_he,
  });

  return mapCategory(doc as unknown as Record<string, unknown>);
}

export async function deleteCategory(slug: string): Promise<void> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  await databases.deleteDocument(DB_ID, CATEGORIES_COL, slug);
}

export async function countRecipesByCategory(slug: string): Promise<number> {
  if (!isAppwriteConfigured()) return 0;

  const response = await databases.listDocuments(DB_ID, RECIPES_COL, [
    Query.equal("category", slug),
    Query.limit(1),
  ]);

  return response.total;
}

export async function seedDefaultCategories(): Promise<void> {
  if (!isAppwriteConfigured()) return;

  const existing = await databases.listDocuments(DB_ID, CATEGORIES_COL, [
    Query.limit(1),
  ]);

  if (existing.total > 0) return;

  for (const category of DEFAULT_CATEGORIES) {
    await databases.createDocument(DB_ID, CATEGORIES_COL, category.slug, {
      slug: category.slug,
      label_en: category.label_en,
      label_he: category.label_he,
      sort_order: category.sort_order,
    });
  }
}

export function getCategorySlugs(categories: Category[]): string[] {
  return categories.map((category) => category.slug);
}
