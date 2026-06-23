"use client";

import { Input } from "@/components/ui/Input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <SearchIcon />
      <Input
        type="search"
        placeholder="Search titles, ingredients, notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
        aria-label="Search recipes"
      />
    </div>
  );
}
