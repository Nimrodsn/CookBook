import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-xl border border-stone/30 bg-white px-4 text-sm text-espresso focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
