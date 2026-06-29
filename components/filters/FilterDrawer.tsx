"use client";

import { useEffect, useState } from "react";
import { useCategories } from "@/components/providers/CategoriesProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: string[];
};

export function FilterDrawer({
  open,
  onClose,
  selectedCategories,
  onCategoriesChange,
  selectedTags,
  onTagsChange,
  allTags,
}: FilterDrawerProps) {
  const { categories } = useCategories();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function toggleCategory(slug: string) {
    if (selectedCategories.includes(slug)) {
      onCategoriesChange(selectedCategories.filter((category) => category !== slug));
    } else {
      onCategoriesChange([...selectedCategories, slug]);
    }
  }

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  }

  function clearAll() {
    onCategoriesChange([]);
    onTagsChange([]);
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-espresso/40"
        onClick={onClose}
        aria-label="Close filters"
      />
      <aside
        className={cn(
          "fixed z-50 flex max-h-[85vh] w-full flex-col bg-warm-white shadow-xl md:max-h-full md:w-96",
          isMobile
            ? "bottom-0 left-0 right-0 rounded-t-2xl"
            : "right-0 top-0 h-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-stone/15 px-4 py-4">
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-lg text-stone hover:bg-cream"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {categories.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.slug}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-cream"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.slug)}
                      onChange={() => toggleCategory(category.slug)}
                      className="h-4 w-4 rounded border-stone/40 text-terracotta focus:ring-terracotta"
                    />
                    <span className="text-sm">
                      {category.label_en}{" "}
                      <span className="text-stone">({category.label_he})</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {allTags.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "min-h-9 rounded-full px-3 text-sm transition-colors",
                      selectedTags.includes(tag)
                        ? "bg-sage text-white"
                        : "bg-cream text-espresso hover:bg-sage/20",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex gap-2 border-t border-stone/15 p-4">
          <Button variant="secondary" className="flex-1" onClick={clearAll}>
            Clear all
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Show results
          </Button>
        </div>
      </aside>
    </>
  );
}
