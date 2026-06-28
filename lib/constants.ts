export const CATEGORIES = {
  meat: { en: "Meat", he: "בשרי" },
  vegetarian: { en: "Vegetarian", he: "צמחוני" },
  dessert: { en: "Dessert", he: "קינוח" },
  gluten_free: { en: "Gluten-Free", he: "ללא גלוטן" },
  dairy: { en: "Dairy", he: "חלבי" },
  salad: { en: "Salad", he: "סלט" },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export const RECIPE_TYPES = ["local", "external"] as const;
export type RecipeType = (typeof RECIPE_TYPES)[number];

export const TABS = [
  { id: "all", label: "All Recipes" },
  { id: "local", label: "My Creations" },
  { id: "external", label: "Saved Links" },
] as const;

export type TabId = (typeof TABS)[number]["id"];
