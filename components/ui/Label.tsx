import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-espresso", className)}
      {...props}
    />
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
};

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-stone">{hint}</p>}
    </div>
  );
}
