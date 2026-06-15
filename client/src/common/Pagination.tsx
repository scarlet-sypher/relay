import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  total,
  limit,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-800">
      <p className="text-xs text-surface-500">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
        {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            "p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors",
            page === 1 && "opacity-30 cursor-not-allowed",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                p === page
                  ? "bg-brand-600 text-white"
                  : "text-surface-400 hover:text-surface-100 hover:bg-surface-800",
              )}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            "p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors",
            page === totalPages && "opacity-30 cursor-not-allowed",
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
