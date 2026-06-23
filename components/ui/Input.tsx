import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl border border-stone/30 bg-white px-4 text-sm text-espresso placeholder:text-stone focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20",
        className,
      )}
      {...props}
    />
  );
}
