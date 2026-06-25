import { z } from "zod";
import { CATEGORY_IDS, type CategoryId } from "@/lib/constants";

const categorySchema = z.enum(
  CATEGORY_IDS as unknown as [CategoryId, ...CategoryId[]],
);

export const transcribedRecipeSchema = z.object({
  title: z.string().trim().min(1),
  ingredients: z.string().trim(),
  instructions: z.string().trim(),
  category: categorySchema.nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
});

export type TranscribedRecipe = z.infer<typeof transcribedRecipeSchema>;

export const transcribedRecipeResponseSchema = z.object({
  title: z.string(),
  ingredients: z.string(),
  instructions: z.string(),
  category: categorySchema.nullable().optional(),
  tags: z.array(z.string()).optional(),
  warning: z.string().optional(),
});

export type TranscribedRecipeResponse = z.infer<
  typeof transcribedRecipeResponseSchema
>;
