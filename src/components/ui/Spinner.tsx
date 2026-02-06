import { cn } from "@/lib/utils";

type SpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8"
};

export function Spinner({ label = "Loading", size = "md" }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <span className={cn("animate-spin rounded-full border-2 border-border border-t-primary", sizeMap[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
