import { z } from "zod";

export const transcribedRecipeSchema = z.object({
  title: z.string().trim().min(1),
  ingredients: z.string().trim(),
  instructions: z.string().trim(),
  category: z.string().trim().max(64).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
});

export type TranscribedRecipe = z.infer<typeof transcribedRecipeSchema>;

export const transcribedRecipeResponseSchema = z.object({
  title: z.string(),
  ingredients: z.string(),
  instructions: z.string(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  warning: z.string().optional(),
});

export type TranscribedRecipeResponse = z.infer<
  typeof transcribedRecipeResponseSchema
>;
