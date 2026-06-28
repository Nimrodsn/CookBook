"use client";

import { CATEGORY_IDS, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CategoryChipFilterProps = {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
};

export function CategoryChipFilter({
  selectedCategories,
  onChange,
}: CategoryChipFilterProps) {
  function toggleCategory(id: string) {
    if (selectedCategories.includes(id)) {
      onChange(selectedCategories.filter((c) => c !== id));
    } else {
      onChange([...selectedCategories, id]);
    }
  }

  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin"
      role="group"
      aria-label="Filter by category"
    >
      {CATEGORY_IDS.map((id) => {
        const selected = selectedCategories.includes(id);
        const { en, he } = CATEGORIES[id];

        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleCategory(id)}
            aria-pressed={selected}
            className={cn(
              "min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
              selected
                ? "bg-terracotta text-white shadow-sm"
                : "bg-warm-white text-espresso ring-1 ring-stone/20 hover:ring-terracotta/40",
            )}
          >
            <span className="whitespace-nowrap">
              {en}{" "}
              <span className={selected ? "text-white/90" : "text-stone"}>
                ({he})
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
