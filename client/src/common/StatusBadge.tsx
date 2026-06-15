import { cn } from "../utils";

interface StatusBadgeProps {
  label: string;
  colorClass: string;
  dot?: boolean;
}

export const StatusBadge = ({
  label,
  colorClass,
  dot = true,
}: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      colorClass,
    )}
  >
    {dot && (
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
    )}
    {label}
  </span>
);
