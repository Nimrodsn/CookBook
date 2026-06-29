"use client";

import { useCategories } from "@/components/providers/CategoriesProvider";
import { cn } from "@/lib/utils";

type CategoryChipFilterProps = {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
};

export function CategoryChipFilter({
  selectedCategories,
  onChange,
}: CategoryChipFilterProps) {
  const { categories } = useCategories();

  function toggleCategory(slug: string) {
    if (selectedCategories.includes(slug)) {
      onChange(selectedCategories.filter((category) => category !== slug));
    } else {
      onChange([...selectedCategories, slug]);
    }
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin"
      role="group"
      aria-label="Filter by category"
    >
      {categories.map((category) => {
        const selected = selectedCategories.includes(category.slug);

        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => toggleCategory(category.slug)}
            aria-pressed={selected}
            className={cn(
              "min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
              selected
                ? "bg-terracotta text-white shadow-sm"
                : "bg-warm-white text-espresso ring-1 ring-stone/20 hover:ring-terracotta/40",
            )}
          >
            <span className="whitespace-nowrap">
              {category.label_en}{" "}
              <span className={selected ? "text-white/90" : "text-stone"}>
                ({category.label_he})
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
