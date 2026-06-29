export const DEFAULT_CATEGORIES = [
  { slug: "meat", label_en: "Meat", label_he: "בשרי", sort_order: 0 },
  { slug: "vegetarian", label_en: "Vegetarian", label_he: "צמחוני", sort_order: 1 },
  { slug: "dessert", label_en: "Dessert", label_he: "קינוח", sort_order: 2 },
  { slug: "gluten_free", label_en: "Gluten-Free", label_he: "ללא גלוטן", sort_order: 3 },
  { slug: "dairy", label_en: "Dairy", label_he: "חלבי", sort_order: 4 },
  { slug: "salad", label_en: "Salad", label_he: "סלט", sort_order: 5 },
  { slug: "soup", label_en: "Soup", label_he: "מרק", sort_order: 6 },
  { slug: "side_dish", label_en: "Side Dish", label_he: "תוספות", sort_order: 7 },
] as const;

export const RECIPE_TYPES = ["local", "external"] as const;
export type RecipeType = (typeof RECIPE_TYPES)[number];

export const TABS = [
  { id: "all", label: "All Recipes" },
  { id: "local", label: "My Creations" },
  { id: "external", label: "Saved Links" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export const MAX_RECIPE_IMAGES = 10;
