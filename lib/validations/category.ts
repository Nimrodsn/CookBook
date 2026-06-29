import { z } from "zod";

export const createCategorySchema = z.object({
  label_en: z.string().trim().min(1, "English label is required").max(128),
  label_he: z.string().trim().min(1, "Hebrew label is required").max(128),
});

export const updateCategorySchema = z.object({
  slug: z.string().trim().min(1).max(64),
  label_en: z.string().trim().min(1, "English label is required").max(128),
  label_he: z.string().trim().min(1, "Hebrew label is required").max(128),
});

export const deleteCategorySchema = z.object({
  slug: z.string().trim().min(1).max(64),
});
