// MB Crunchy — Product Filters & Sort Controls
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ArrowUpDown, Search } from "lucide-react";
import type { SortOption } from "@/data/products";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  vegOnly: boolean;
  onVegChange: (v: boolean) => void;
  nonVegOnly: boolean;
  onNonVegChange: (v: boolean) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  totalProducts: number;
  filteredCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Most Popular" },
  { value: "discount", label: "Biggest Discount" },
  { value: "name", label: "Alphabetical" },
];

export default function ProductFilters({
  search, onSearchChange,
  vegOnly, onVegChange,
  nonVegOnly, onNonVegChange,
  sort, onSortChange,
  totalProducts, filteredCount,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="space-y-3">
      {/* Search + Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-8 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            aria-label="Search products"
          />
          {search && (
            <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all duration-200 ${
            showFilters || vegOnly || nonVegOnly
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className={`flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all duration-200 ${
              sort !== "default"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            aria-label="Sort options"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{sortOptions.find(o => o.value === sort)?.label ?? "Sort"}</span>
          </button>

          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-border bg-white shadow-xl"
              >
                <div className="p-1.5">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        sort === opt.value ? "bg-primary/5 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Veg/Non-Veg Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { onVegChange(!vegOnly); if (nonVegOnly) onNonVegChange(false); }}
                    className={`flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                      vegOnly
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-border text-muted-foreground hover:border-emerald-300"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full border-2 border-emerald-500"><span className="block h-1.5 w-1.5 rounded-full bg-emerald-500 m-[1.5px]" /></span>
                    Veg
                  </button>
                  <button
                    onClick={() => { onNonVegChange(!nonVegOnly); if (vegOnly) onVegChange(false); }}
                    className={`flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                      nonVegOnly
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-border text-muted-foreground hover:border-red-300"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full border-2 border-red-500"><span className="block h-1.5 w-1.5 rounded-full bg-red-500 m-[1.5px]" /></span>
                    Non-Veg
                  </button>
                </div>

                {/* Clear */}
                {(vegOnly || nonVegOnly) && (
                  <button
                    onClick={() => { onVegChange(false); onNonVegChange(false); }}
                    className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredCount}</span> of {totalProducts} products
      </p>
    </div>
  );
}
