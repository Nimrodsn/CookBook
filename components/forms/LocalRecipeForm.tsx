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
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CATEGORY_IDS, CATEGORIES } from "@/lib/constants";

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
        <Select name="category" required defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORY_IDS.map((id) => (
            <option key={id} value={id}>
              {CATEGORIES[id].en} ({CATEGORIES[id].he})
            </option>
          ))}
        </Select>
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

      <Field label="Photo">
        <Input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="file:mr-4 file:rounded-lg file:border-0 file:bg-terracotta file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-terracotta-light"
        />
      </Field>

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
