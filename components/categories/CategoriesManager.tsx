"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "@/app/actions/categories";
import { slugifyCategoryName } from "@/lib/categories";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

type CategoriesManagerProps = {
  categories: Category[];
};

const initialState: CategoryActionState = {};

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const [createState, createAction, createPending] = useActionState(
    createCategoryAction,
    initialState,
  );
  const [labelEn, setLabelEn] = useState("");
  const [labelHe, setLabelHe] = useState("");
  const [actionError, setActionError] = useState("");

  const slugPreview = labelEn ? slugifyCategoryName(labelEn) : "";

  useEffect(() => {
    if (createState.success) {
      setLabelEn("");
      setLabelHe("");
    }
  }, [createState.success]);

  async function handleDelete(slug: string, label: string) {
    if (!confirm(`Delete category "${label}"?`)) return;

    setActionError("");
    const result = await deleteCategoryAction(slug);
    if (result.error) {
      setActionError(result.error);
    }
  }

  return (
    <div className="space-y-8">
      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <section className="rounded-2xl border border-stone/15 bg-warm-white p-6">
        <h2 className="font-display mb-4 text-xl font-semibold">Add Category</h2>
        <form action={createAction} className="space-y-4">
          {createState.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {createState.error}
            </div>
          )}

          <Field label="English name">
            <Input
              name="label_en"
              required
              placeholder="Breakfast"
              value={labelEn}
              onChange={(event) => setLabelEn(event.target.value)}
            />
          </Field>

          <Field label="Hebrew name">
            <Input
              name="label_he"
              required
              placeholder="ארוחת בוקר"
              value={labelHe}
              onChange={(event) => setLabelHe(event.target.value)}
            />
          </Field>

          {slugPreview && (
            <p className="text-sm text-stone">
              Category ID: <code className="rounded bg-cream px-1">{slugPreview}</code>
            </p>
          )}

          <Button type="submit" disabled={createPending}>
            {createPending ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Existing Categories</h2>

        {categories.length === 0 ? (
          <p className="text-sm text-stone">No categories yet.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryRow
                key={category.slug}
                category={category}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryRow({
  category,
  onDelete,
}: {
  category: Category;
  onDelete: (slug: string, label: string) => void;
}) {
  const [state, formAction, pending] = useActionState(
    updateCategoryAction,
    initialState,
  );

  return (
    <div className="rounded-2xl border border-stone/15 bg-warm-white p-5">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="slug" value={category.slug} />

        {state.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Category updated.
          </div>
        )}

        <p className="text-sm text-stone">
          ID: <code className="rounded bg-cream px-1">{category.slug}</code>
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="English name">
            <Input
              name="label_en"
              required
              defaultValue={category.label_en}
            />
          </Field>
          <Field label="Hebrew name">
            <Input
              name="label_he"
              required
              defaultValue={category.label_he}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onDelete(category.slug, category.label_en)}
          >
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
