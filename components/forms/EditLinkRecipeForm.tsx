"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  updateExternalRecipe,
  type ActionState,
} from "@/app/actions/recipes";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RecipePhotosField } from "@/components/forms/RecipePhotosField";
import { CategorySelect } from "@/components/forms/CategorySelect";
import type { Recipe } from "@/lib/types";
import { formatTagsForInput, getRecipeImages } from "@/lib/utils";

type EditLinkRecipeFormProps = {
  recipe: Recipe;
};

export function EditLinkRecipeForm({ recipe }: EditLinkRecipeFormProps) {
  const boundAction = updateExternalRecipe.bind(null, recipe.$id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    boundAction,
    {},
  );

  const existingUrls = getRecipeImages(recipe).map((image) => image.url);
  const [imageUrls, setImageUrls] = useState<string[]>(
    existingUrls.length > 0 ? existingUrls : [""],
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Recipe URL">
        <Input
          name="url"
          type="url"
          required
          defaultValue={recipe.url ?? ""}
        />
      </Field>

      <RecipePhotosField
        mode="external"
        imageUrls={imageUrls}
        onImageUrlsChange={setImageUrls}
      />

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

      <Field label="My Custom Notes">
        <Textarea
          name="custom_notes"
          defaultValue={recipe.custom_notes ?? ""}
          className="min-h-48"
        />
      </Field>

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
