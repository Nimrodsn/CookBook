import type { RecipeType } from "./constants";

export interface Category {
  $id: string;
  slug: string;
  label_en: string;
  label_he: string;
  sort_order: number;
}

export interface Recipe {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  type: RecipeType;
  url?: string | null;
  image_url?: string | null;
  image_file_id?: string | null;
  image_urls?: string[];
  image_file_ids?: string[];
  category: string;
  tags: string[];
  ingredients?: string | null;
  instructions?: string | null;
  custom_notes?: string | null;
}

export type RecipeInput = Omit<
  Recipe,
  "$id" | "$createdAt" | "$updatedAt"
>;

export interface ScrapeResult {
  title: string;
  image: string;
  description: string;
}
