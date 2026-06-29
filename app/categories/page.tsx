import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CategoriesManager } from "@/components/categories/CategoriesManager";
import { getCategories, seedDefaultCategories } from "@/lib/appwrite/categories";
import { getAppwriteErrorMessage } from "@/lib/appwrite/errors";

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let error: string | undefined;

  try {
    await seedDefaultCategories();
    categories = await getCategories();
  } catch (err) {
    error = getAppwriteErrorMessage(err);
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <Link href="/" className="text-sm text-stone hover:text-terracotta">
            ← Back to recipes
          </Link>
          <h1 className="font-display mt-2 text-3xl font-semibold text-espresso">
            Manage Categories
          </h1>
          <p className="mt-1 text-stone">
            Add categories or edit their English and Hebrew names. The category ID
            is set when created and cannot be changed.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <CategoriesManager categories={categories} />
      </main>
    </>
  );
}
