import type { CategoryId, RecipeType } from "./constants";

export interface Recipe {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  type: RecipeType;
  url?: string | null;
  image_url?: string | null;
  image_file_id?: string | null;
  category: CategoryId;
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
