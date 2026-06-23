import { z } from "zod";
import { CATEGORY_IDS, type CategoryId } from "@/lib/constants";

const categorySchema = z.enum(
  CATEGORY_IDS as unknown as [CategoryId, ...CategoryId[]],
);

const tagsSchema = z
  .array(z.string().trim().min(1).max(64))
  .max(20)
  .default([]);

export const localRecipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(512),
  category: categorySchema,
  tags: tagsSchema,
  ingredients: z.string().trim().max(10000).optional(),
  instructions: z.string().trim().max(20000).optional(),
});

export const externalRecipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(512),
  url: z.string().url("Must be a valid URL").max(2048),
  image_url: z.string().url().max(2048).optional().or(z.literal("")),
  category: categorySchema,
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
