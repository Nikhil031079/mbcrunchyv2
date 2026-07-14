// MB Crunchy — Responsive Search Bar Component
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  mobile?: boolean;
  onClose?: () => void;
}

export default function SearchBar({ className, mobile, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub — search to be implemented in later phases
    console.log("[Search] query:", query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center",
        isFocused && "ring-2 ring-primary",
        className,
      )}
    >
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full border-2 border-black bg-white px-3 py-2 pr-20 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          aria-label="Search products"
        />
        <div className="absolute right-0 top-0 flex h-full items-center gap-1 pr-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="flex h-7 w-7 items-center justify-center border border-black bg-muted hover:bg-muted-foreground/20 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="flex h-7 w-8 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {mobile && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 border-2 border-black px-3 py-2 text-xs font-bold uppercase hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
