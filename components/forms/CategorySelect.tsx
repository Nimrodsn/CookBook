"use client";

import { Select } from "@/components/ui/Select";
import { useCategories } from "@/components/providers/CategoriesProvider";

type CategorySelectProps = {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
};

export function CategorySelect({
  name = "category",
  defaultValue = "",
  value,
  onChange,
  required = true,
}: CategorySelectProps) {
  const { categories } = useCategories();
  const isControlled = value !== undefined;

  return (
    <Select
      name={name}
      required={required}
      defaultValue={isControlled ? undefined : defaultValue}
      value={isControlled ? value : undefined}
      onChange={onChange}
    >
      {!isControlled && !defaultValue && (
        <option value="" disabled>
          Select a category
        </option>
      )}
      {isControlled && !value && (
        <option value="" disabled>
          Select a category
        </option>
      )}
      {categories.map((category) => (
        <option key={category.slug} value={category.slug}>
          {category.label_en} ({category.label_he})
        </option>
      ))}
    </Select>
  );
}
