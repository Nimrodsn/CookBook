export function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

export function isValidCategorySlug(slug: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(slug) && slug.length <= 64;
}
