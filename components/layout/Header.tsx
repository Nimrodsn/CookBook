import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone/15 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold text-espresso">
          Family Cookbook
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/categories" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              Categories
            </Button>
          </Link>
          <Link href="/recipes/scan">
            <Button variant="secondary" size="sm" className="sm:hidden">
              Scan
            </Button>
          </Link>
          <Link href="/recipes/scan" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              Scan Recipe
            </Button>
          </Link>
          <Link href="/recipes/new/link">
            <Button variant="secondary" size="sm">
              Save Link
            </Button>
          </Link>
          <Link href="/recipes/new">
            <Button size="sm">Add Recipe</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
