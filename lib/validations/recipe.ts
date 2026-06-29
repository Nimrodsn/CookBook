import { z } from "zod";
import { MAX_RECIPE_IMAGES } from "@/lib/constants";

const tagsSchema = z
  .array(z.string().trim().min(1).max(64))
  .max(20)
  .default([]);

export const imageUrlsSchema = z
  .array(z.string().url("Must be a valid image URL").max(2048))
  .max(MAX_RECIPE_IMAGES, `Maximum ${MAX_RECIPE_IMAGES} photos allowed`)
  .default([]);

export const localRecipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(512),
  category: z.string().trim().min(1, "Category is required").max(64),
  tags: tagsSchema,
  ingredients: z.string().trim().max(10000).optional(),
  instructions: z.string().trim().max(20000).optional(),
});

export const externalRecipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(512),
  url: z.string().url("Must be a valid URL").max(2048),
  image_urls: imageUrlsSchema,
  category: z.string().trim().min(1, "Category is required").max(64),
  tags: tagsSchema,
  custom_notes: z.string().trim().max(10000).optional(),
});

export const scrapeUrlSchema = z.object({
  url: z
    .string()
    .url("Must be a valid URL")
    .refine((url) => url.startsWith("https://"), {
      message: "URL must use HTTPS",
    }),
});

export function validateCategorySlug(
  category: string,
  allowedSlugs: string[],
): string | null {
  if (!allowedSlugs.includes(category)) {
    return "Please select a valid category.";
  }
  return null;
}
