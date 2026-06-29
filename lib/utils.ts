import type { Recipe } from "./types";

export type RecipeImage = {
  url: string;
  fileId: string | null;
};

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getRecipeImages(recipe: Recipe): RecipeImage[] {
  const urls = recipe.image_urls?.filter(Boolean) ?? [];
  const fileIds = recipe.image_file_ids ?? [];

  if (urls.length > 0) {
    return urls.map((url, index) => ({
      url,
      fileId: fileIds[index]?.trim() ? fileIds[index] : null,
    }));
  }

  if (recipe.image_url) {
    return [
      {
        url: recipe.image_url,
        fileId: recipe.image_file_id ?? null,
      },
    ];
  }

  return [];
}

export function getRecipeImageUrl(recipe: Recipe): string | null {
  return getRecipeImages(recipe)[0]?.url ?? null;
}

export function getAllRecipeFileIds(recipe: Recipe): string[] {
  const ids = new Set<string>();
  for (const image of getRecipeImages(recipe)) {
    if (image.fileId) ids.add(image.fileId);
  }
  if (recipe.image_file_id) ids.add(recipe.image_file_id);
  return Array.from(ids);
}

export function matchesSearch(recipe: Recipe, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const fields = [
    recipe.title,
    recipe.ingredients ?? "",
    recipe.custom_notes ?? "",
    recipe.instructions ?? "",
  ];
  return fields.some((field) => field.toLowerCase().includes(q));
}

export function collectAllTags(recipes: Recipe[]): string[] {
  const tagSet = new Set<string>();
  for (const recipe of recipes) {
    for (const tag of recipe.tags ?? []) {
      if (tag.trim()) tagSet.add(tag.trim());
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(", ");
}
