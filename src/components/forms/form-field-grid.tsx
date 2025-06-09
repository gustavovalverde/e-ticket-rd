import { cn } from "@/lib/utils";

interface FormFieldGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export function FormFieldGrid({
  children,
  columns = 2,
  className,
}: FormFieldGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function FormField({
  children,
  fullWidth = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn(fullWidth && "md:col-span-2", className)}>
      {children}
    </div>
  );
}
