"use client";

import { removeRecipe } from "@/app/actions/recipes";
import { Button } from "@/components/ui/Button";
import type { Recipe } from "@/lib/types";

type DeleteRecipeButtonProps = {
  recipe: Recipe;
};

export function DeleteRecipeButton({ recipe }: DeleteRecipeButtonProps) {
  async function handleDelete() {
    if (
      !confirm(
        `Delete "${recipe.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    await removeRecipe(recipe.$id);
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  );
}
