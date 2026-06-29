"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createLocalRecipe,
  type ActionState,
} from "@/app/actions/recipes";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CategorySelect } from "@/components/forms/CategorySelect";
import { RecipePhotosField } from "@/components/forms/RecipePhotosField";

const initialState: ActionState = {};

export function LocalRecipeForm() {
  const [state, formAction, pending] = useActionState(
    createLocalRecipe,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Title">
        <Input name="title" required placeholder="Grandma's Challah" />
      </Field>

      <Field label="Category">
        <CategorySelect />
      </Field>

      <Field label="Tags" hint="Comma-separated, e.g. Quick, Kids Love, Shabbat">
        <Input name="tags" placeholder="Quick, Shabbat" />
      </Field>

      <Field label="Ingredients">
        <Textarea
          name="ingredients"
          placeholder="2 cups flour&#10;1 tsp salt&#10;..."
          className="min-h-40"
        />
      </Field>

      <Field label="Instructions">
        <Textarea
          name="instructions"
          placeholder="Step 1: Mix dry ingredients..."
          className="min-h-48"
        />
      </Field>

      <RecipePhotosField mode="local" />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Saving..." : "Save Recipe"}
        </Button>
        <Link href="/" className="flex-1">
          <Button type="button" variant="secondary" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
