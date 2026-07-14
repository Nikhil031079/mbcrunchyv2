// MB Crunchy — Kitchen Page
import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, ChevronRight, ArrowUpDown } from "lucide-react";
import { kitchenCategories, kitchenCombosData, kitchenPartyPacksData, getAllKitchenProducts, filterProducts, sortProducts, type SortOption } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import CategoryBanner from "@/components/product/CategoryBanner";
import ComboCard from "@/components/product/ComboCard";
import FloatingCart from "@/components/product/FloatingCart";

export default function Kitchen() {
  const [activeCategory, setActiveCategory] = useState<string>(kitchenCategories[0]?.key ?? "");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("default");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to category
  const scrollToCategory = (key: string) => {
    setActiveCategory(key);
    const el = categoryRefs.current[key];
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = 200;
      for (const cat of kitchenCategories) {
        const el = categoryRefs.current[cat.key];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            setActiveCategory(cat.key);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // All products for filtering
  const allProducts = useMemo(() => getAllKitchenProducts(), []);

  const allFiltered = useMemo(() => {
    let result = filterProducts(allProducts, { veg: vegOnly || nonVegOnly ? vegOnly : undefined, nonVeg: nonVegOnly, search });
    return sortProducts(result, sort);
  }, [allProducts, vegOnly, nonVegOnly, search, sort]);

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary/5 to-muted/30 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kitchen</h1>
              <p className="text-sm text-muted-foreground">Freshly prepared food, delivered fast</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <ProductFilters
          search={search} onSearchChange={setSearch}
          vegOnly={vegOnly} onVegChange={setVegOnly}
          nonVegOnly={nonVegOnly} onNonVegChange={setNonVegOnly}
          sort={sort} onSortChange={setSort}
          totalProducts={allProducts.length}
          filteredCount={allFiltered.length}
        />

        {/* Sticky Category Nav */}
        <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/40">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {kitchenCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => scrollToCategory(cat.key)}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <span className="mr-1.5">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* If searching/showing filtered results */}
        {(search || vegOnly || nonVegOnly || sort !== "default") && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Search Results</h2>
              {(search || vegOnly || nonVegOnly) && (
                <button
                  onClick={() => { setSearch(""); setVegOnly(false); setNonVegOnly(false); setSort("default"); }}
                  className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            {allFiltered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {allFiltered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-5xl">🔍</span>
                <p className="mt-4 text-sm text-muted-foreground">No products found matching your criteria.</p>
                <button
                  onClick={() => { setSearch(""); setVegOnly(false); setNonVegOnly(false); }}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category Sections */}
        {!search && !vegOnly && !nonVegOnly && sort === "default" && (
          <div className="mt-8 space-y-12">
            {kitchenCategories.map((cat) => (
              <div key={cat.key} ref={(el) => { categoryRefs.current[cat.key] = el; }}>
                <CategoryBanner name={cat.name} description={cat.description} emoji={cat.emoji} />
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {cat.products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Combos Section */}
        {!search && !vegOnly && !nonVegOnly && sort === "default" && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Value Combos</h2>
                <p className="text-sm text-muted-foreground">Save big with our curated combos</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kitchenCombosData.map((combo, i) => (
                <ComboCard key={combo.id} product={combo} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Party Packs Section */}
        {!search && !vegOnly && !nonVegOnly && sort === "default" && (
          <section className="mt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Party Packs</h2>
                <p className="text-sm text-muted-foreground">Perfect for gatherings and celebrations</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kitchenPartyPacksData.map((pack, i) => (
                <ComboCard key={pack.id} product={pack} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <FloatingCart />
    </div>
  );
}
