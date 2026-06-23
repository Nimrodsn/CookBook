import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-xl border border-stone/30 bg-white px-4 py-3 text-sm text-espresso placeholder:text-stone focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20",
        className,
      )}
      {...props}
    />
  );
}
