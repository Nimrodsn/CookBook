"use client";

import { createContext, useContext, useMemo } from "react";
import type { Category } from "@/lib/types";

type CategoryLabel = {
  en: string;
  he: string;
};

type CategoriesContextValue = {
  categories: Category[];
  categorySlugs: string[];
  getCategoryLabel: (slug: string) => CategoryLabel;
};

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

type CategoriesProviderProps = {
  categories: Category[];
  children: React.ReactNode;
};

export function CategoriesProvider({
  categories,
  children,
}: CategoriesProviderProps) {
  const value = useMemo<CategoriesContextValue>(() => {
    const bySlug = new Map(categories.map((category) => [category.slug, category]));

    return {
      categories,
      categorySlugs: categories.map((category) => category.slug),
      getCategoryLabel: (slug: string) => {
        const category = bySlug.get(slug);
        if (category) {
          return { en: category.label_en, he: category.label_he };
        }
        return { en: slug, he: slug };
      },
    };
  }, [categories]);

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories(): CategoriesContextValue {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return context;
}
