import { Search, X } from "lucide-react";
import { cn } from "../utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) => (
  <div className={cn("relative", className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-base !pl-9 !pr-8"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
