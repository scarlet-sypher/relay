import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center text-surface-500">
      {icon}
    </div>
    <div className="text-center">
      <p className="text-surface-200 font-medium">{title}</p>
      {description && (
        <p className="text-sm text-surface-500 mt-1 max-w-xs">{description}</p>
      )}
    </div>
    {action}
  </div>
);
