"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants";
import type { Recipe } from "@/lib/types";
import { getRecipeImageUrl } from "@/lib/utils";

type RecipeCardProps = {
  recipe: Recipe;
};

function TypeIcon({ type }: { type: Recipe["type"] }) {
  if (type === "external") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const imageUrl = getRecipeImageUrl(recipe);
  const category = CATEGORIES[recipe.category];
  const visibleTags = recipe.tags?.slice(0, 3) ?? [];
  const extraTags = (recipe.tags?.length ?? 0) - visibleTags.length;

  return (
    <Link
      href={`/recipes/${recipe.$id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone/15 bg-warm-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-cream">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone/50">
            <span className="font-display text-4xl">{category.he.charAt(0)}</span>
          </div>
        )}
        <div className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-stone shadow-sm">
          <TypeIcon type={recipe.type} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display line-clamp-2 text-lg font-semibold leading-snug text-espresso group-hover:text-terracotta">
          {recipe.title}
        </h3>
        <Badge variant="category">{category.he}</Badge>
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
            {extraTags > 0 && <Badge variant="type">+{extraTags}</Badge>}
          </div>
        )}
      </div>
    </Link>
  );
}
