import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryLabels } from "@/components/categories/CategoryLabels";
import { Header } from "@/components/layout/Header";
import { DeleteRecipeButton } from "@/components/forms/DeleteRecipeButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getRecipe } from "@/lib/appwrite/recipes";
import { getRecipeImages } from "@/lib/utils";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  const images = getRecipeImages(recipe);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-stone hover:text-terracotta">
            ← Back to recipes
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/recipes/${recipe.$id}/edit`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            <DeleteRecipeButton recipe={recipe} />
          </div>
        </div>

        {images.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-stone/15">
              <Image
                src={images[0].url}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.slice(1).map((image) => (
                  <div
                    key={image.url}
                    className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl border border-stone/15"
                  >
                    <Image
                      src={image.url}
                      alt={`${recipe.title} photo`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-espresso">
              {recipe.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="category">
                <CategoryLabels slug={recipe.category} variant="text" />
              </Badge>
              <Badge variant="type">
                {recipe.type === "local" ? "My Creation" : "Saved Link"}
              </Badge>
              {recipe.tags?.map((tag) => (
                <Badge key={tag} variant="tag">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {recipe.type === "external" && recipe.url && (
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-terracotta px-4 text-sm font-medium text-white hover:bg-terracotta-light"
            >
              Open original recipe ↗
            </a>
          )}

          {recipe.type === "local" && (
            <>
              {recipe.ingredients && (
                <section className="rounded-2xl border border-stone/15 bg-warm-white p-6">
                  <h2 className="font-display mb-3 text-xl font-semibold">
                    Ingredients
                  </h2>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-espresso">
                    {recipe.ingredients}
                  </pre>
                </section>
              )}
              {recipe.instructions && (
                <section className="rounded-2xl border border-stone/15 bg-warm-white p-6">
                  <h2 className="font-display mb-3 text-xl font-semibold">
                    Instructions
                  </h2>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-espresso">
                    {recipe.instructions}
                  </pre>
                </section>
              )}
            </>
          )}

          {recipe.type === "external" && recipe.custom_notes && (
            <section className="rounded-2xl border border-stone/15 bg-warm-white p-6">
              <h2 className="font-display mb-3 text-xl font-semibold">
                My Custom Notes
              </h2>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-espresso">
                {recipe.custom_notes}
              </pre>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
