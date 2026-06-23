import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "@/lib/types";

type RecipeGridProps = {
  recipes: Recipe[];
};

export function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone/30 bg-warm-white px-6 py-16 text-center">
        <p className="font-display text-xl text-espresso">No recipes found</p>
        <p className="mt-2 text-sm text-stone">
          Try adjusting your filters or add a new recipe.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.$id} recipe={recipe} />
      ))}
    </div>
  );
}
