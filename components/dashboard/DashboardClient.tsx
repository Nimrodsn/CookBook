"use client";

import { useMemo, useState } from "react";
import { FilterDrawer } from "@/components/filters/FilterDrawer";
import { SearchBar } from "@/components/filters/SearchBar";
import { RecipeGrid } from "@/components/dashboard/RecipeGrid";
import { TabNav } from "@/components/dashboard/TabNav";
import { Button } from "@/components/ui/Button";
import type { TabId } from "@/lib/constants";
import type { Recipe } from "@/lib/types";
import { collectAllTags, matchesSearch } from "@/lib/utils";

type DashboardClientProps = {
  recipes: Recipe[];
  configured: boolean;
  error?: string;
};

export function DashboardClient({
  recipes,
  configured,
  error,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => collectAllTags(recipes), [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (activeTab !== "all" && recipe.type !== activeTab) return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(recipe.category)
      ) {
        return false;
      }
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => recipe.tags?.includes(tag))
      ) {
        return false;
      }
      return matchesSearch(recipe, search);
    });
  }, [recipes, activeTab, selectedCategories, selectedTags, search]);

  const activeFilterCount =
    selectedCategories.length + selectedTags.length;

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <strong className="font-medium">Appwrite connection error:</strong>{" "}
          {error}
        </div>
      )}

      {!configured && !error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Appwrite is not configured. Copy{" "}
          <code className="rounded bg-amber-100 px-1">.env.local.example</code>{" "}
          to <code className="rounded bg-amber-100 px-1">.env.local</code> and
          follow <code className="rounded bg-amber-100 px-1">scripts/setup-appwrite.md</code>.
        </div>
      )}

      <TabNav activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex gap-2">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <Button
          variant="secondary"
          onClick={() => setFilterOpen(true)}
          className="relative shrink-0"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <p className="text-sm text-stone">
        {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""}
      </p>

      <RecipeGrid recipes={filteredRecipes} />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        allTags={allTags}
      />
    </div>
  );
}
