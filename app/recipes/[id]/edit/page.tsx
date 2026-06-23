import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { EditLinkRecipeForm } from "@/components/forms/EditLinkRecipeForm";
import { EditLocalRecipeForm } from "@/components/forms/EditLocalRecipeForm";
import { getRecipe } from "@/lib/appwrite/recipes";

type EditRecipePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-4">
          <Link
            href={`/recipes/${recipe.$id}`}
            className="text-sm text-stone hover:text-terracotta"
          >
            ← Back to recipe
          </Link>
        </div>
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-espresso">
            Edit Recipe
          </h1>
        </div>
        <div className="rounded-2xl border border-stone/15 bg-warm-white p-6 shadow-sm">
          {recipe.type === "local" ? (
            <EditLocalRecipeForm recipe={recipe} />
          ) : (
            <EditLinkRecipeForm recipe={recipe} />
          )}
        </div>
      </main>
    </>
  );
}
