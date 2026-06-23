import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "category" | "tag" | "type";
  className?: string;
};

const variants = {
  category: "bg-terracotta/10 text-terracotta",
  tag: "bg-sage/15 text-sage",
  type: "bg-stone/15 text-stone",
};

export function Badge({
  children,
  variant = "tag",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
