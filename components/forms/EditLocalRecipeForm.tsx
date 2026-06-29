"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  updateLocalRecipe,
  type ActionState,
} from "@/app/actions/recipes";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CategorySelect } from "@/components/forms/CategorySelect";
import { RecipePhotosField } from "@/components/forms/RecipePhotosField";
import type { Recipe } from "@/lib/types";
import { formatTagsForInput, getRecipeImages } from "@/lib/utils";

type EditLocalRecipeFormProps = {
  recipe: Recipe;
};

export function EditLocalRecipeForm({ recipe }: EditLocalRecipeFormProps) {
  const boundAction = updateLocalRecipe.bind(null, recipe.$id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    boundAction,
    {},
  );

  const existingImages = getRecipeImages(recipe);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Title">
        <Input name="title" required defaultValue={recipe.title} />
      </Field>

      <Field label="Category">
        <CategorySelect defaultValue={recipe.category} />
      </Field>

      <Field label="Tags" hint="Comma-separated">
        <Input
          name="tags"
          defaultValue={formatTagsForInput(recipe.tags ?? [])}
        />
      </Field>

      <Field label="Ingredients">
        <Textarea
          name="ingredients"
          defaultValue={recipe.ingredients ?? ""}
          className="min-h-40"
        />
      </Field>

      <Field label="Instructions">
        <Textarea
          name="instructions"
          defaultValue={recipe.instructions ?? ""}
          className="min-h-48"
        />
      </Field>

      <RecipePhotosField
        mode="local"
        label="Photos"
        hint="Add, remove, or replace photos. The first photo is the cover."
        initialImages={existingImages}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Saving..." : "Save Changes"}
        </Button>
        <Link href={`/recipes/${recipe.$id}`} className="flex-1">
          <Button type="button" variant="secondary" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
