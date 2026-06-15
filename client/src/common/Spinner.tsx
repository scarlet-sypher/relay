import { cn } from "../utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

export const Spinner = ({ size = "md", className }: SpinnerProps) => (
  <div
    className={cn(
      "rounded-full border-2 border-surface-700 border-t-brand-500 animate-spin",
      SIZES[size],
      className,
    )}
  />
);
