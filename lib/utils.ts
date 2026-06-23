import type { Recipe } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getRecipeImageUrl(recipe: Recipe): string | null {
  if (recipe.image_url) return recipe.image_url;
  return null;
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
