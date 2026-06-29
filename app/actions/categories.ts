"use server";

import { revalidatePath } from "next/cache";
import { isValidCategorySlug, slugifyCategoryName } from "@/lib/categories";
import {
  countRecipesByCategory,
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "@/lib/appwrite/categories";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/category";

export type CategoryActionState = {
  error?: string;
  success?: boolean;
};

function revalidateCategoryPaths() {
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/recipes/new");
  revalidatePath("/recipes/new/link");
  revalidatePath("/recipes/scan");
}

export async function createCategoryAction(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const parsed = createCategorySchema.safeParse({
    label_en: formData.get("label_en"),
    label_he: formData.get("label_he"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const slug = slugifyCategoryName(parsed.data.label_en);
  if (!slug || !isValidCategorySlug(slug)) {
    return {
      error: "Could not generate a valid category ID from the English name.",
    };
  }

  const existing = await getCategoryBySlug(slug);
  if (existing) {
    return { error: "A category with this ID already exists. Try a different English name." };
  }

  const categories = await getCategories();
  const nextSortOrder =
    categories.reduce((max, category) => Math.max(max, category.sort_order), -1) + 1;

  try {
    await createCategory({
      slug,
      label_en: parsed.data.label_en,
      label_he: parsed.data.label_he,
      sort_order: nextSortOrder,
    });
  } catch {
    return { error: "Failed to create category. Check Appwrite configuration." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function updateCategoryAction(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const parsed = updateCategorySchema.safeParse({
    slug: formData.get("slug"),
    label_en: formData.get("label_en"),
    label_he: formData.get("label_he"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await getCategoryBySlug(parsed.data.slug);
  if (!existing) {
    return { error: "Category not found." };
  }

  try {
    await updateCategory(parsed.data.slug, {
      label_en: parsed.data.label_en,
      label_he: parsed.data.label_he,
    });
  } catch {
    return { error: "Failed to update category." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function deleteCategoryAction(
  slug: string,
): Promise<CategoryActionState> {
  const parsed = deleteCategorySchema.safeParse({ slug });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const recipeCount = await countRecipesByCategory(parsed.data.slug);
  if (recipeCount > 0) {
    return {
      error: `Cannot delete this category — ${recipeCount} recipe${recipeCount === 1 ? "" : "s"} still use it.`,
    };
  }

  try {
    await deleteCategory(parsed.data.slug);
  } catch {
    return { error: "Failed to delete category." };
  }

  revalidateCategoryPaths();
  return { success: true };
}
