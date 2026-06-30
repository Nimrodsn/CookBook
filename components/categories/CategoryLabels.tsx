"use client";

import { Badge } from "@/components/ui/Badge";
import { useCategories } from "@/components/providers/CategoriesProvider";

type CategoryLabelsProps = {
  slug: string;
  variant?: "badge" | "text";
};

export function CategoryLabels({
  slug,
  variant = "badge",
}: CategoryLabelsProps) {
  const { getCategoryLabel } = useCategories();
  const { en, he } = getCategoryLabel(slug);

  if (variant === "text") {
    return (
      <>
        {en} · {he}
      </>
    );
  }

  return <Badge variant="category">{he}</Badge>;
}

export function CategoryInitial({ slug }: { slug: string }) {
  const { getCategoryLabel } = useCategories();
  const { he } = getCategoryLabel(slug);
  return he.charAt(0) || "?";
}
