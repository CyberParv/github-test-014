import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-foreground",
  success: "bg-success text-white",
  error: "bg-error text-white",
  outline: "border border-border text-foreground"
};

export function Badge({
  variant = "default",
  className,
  children
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", variantClasses[variant], className)}>
      {children}
    </span>
  );
}
