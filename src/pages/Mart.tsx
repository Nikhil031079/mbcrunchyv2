// MB Crunchy — Mart Page (Convex-Powered)
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShoppingBag } from "lucide-react";
import { mapConvexProduct, filterProducts, sortProducts, type SortOption } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import CategoryBanner from "@/components/product/CategoryBanner";
import FloatingCart from "@/components/product/FloatingCart";

export default function Mart() {
  const products = useQuery(api.products.list, { businessType: "mart", status: "active" });
  const categories = useQuery(api.categories.list, { businessType: "both" });

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("default");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);

  const scrollToCategory = (slug: string) => {
    setActiveCategory(slug);
    const el = categoryRefs.current[slug];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!categories) return;
      const offset = 200;
      for (const cat of categories) {
        const el = categoryRefs.current[cat.slug];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) setActiveCategory(cat.slug);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const mappedProducts = useMemo(() => {
    if (!products) return [];
    return products.map(p => mapConvexProduct(p));
  }, [products]);

  const allFiltered = useMemo(() => {
    let result = filterProducts(mappedProducts, { veg: vegOnly || nonVegOnly ? vegOnly : undefined, nonVeg: nonVegOnly, search });
    return sortProducts(result, sort);
  }, [mappedProducts, vegOnly, nonVegOnly, search, sort]);

  const categorySections = useMemo(() => {
    if (!categories || !products) return [];
    const martCats = categories.filter(c => c.businessType === "mart" || c.businessType === "both");
    return martCats.map(cat => {
      const catProducts = mappedProducts.filter(p => p.categoryId === cat._id);
      return { ...cat, products: catProducts };
    }).filter(cat => cat.products.length > 0);
  }, [categories, products, mappedProducts]);

  if (!products || !categories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse rounded-2xl bg-muted h-12 w-48" />
          <p className="text-sm text-muted-foreground">Loading mart...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-emerald-500/5 to-muted/30 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mart</h1>
              <p className="text-sm text-muted-foreground">Premium groceries & essentials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <ProductFilters
          search={search} onSearchChange={setSearch}
          vegOnly={vegOnly} onVegChange={setVegOnly}
          nonVegOnly={nonVegOnly} onNonVegChange={setNonVegOnly}
          sort={sort} onSortChange={setSort}
          totalProducts={mappedProducts.length}
          filteredCount={allFiltered.length}
        />

        {categorySections.length > 0 && (
          <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/40">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categorySections.map((cat) => (
                <button key={cat.slug} onClick={() => scrollToCategory(cat.slug)}
                  className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.slug ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <span className="mr-1.5">{cat.icon ?? "📦"}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {(search || vegOnly || nonVegOnly || sort !== "default") && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Search Results</h2>
              {(search || vegOnly || nonVegOnly) && (
                <button onClick={() => { setSearch(""); setVegOnly(false); setNonVegOnly(false); setSort("default"); }}
                  className="text-xs text-muted-foreground hover:text-primary underline transition-colors">Clear all</button>
              )}
            </div>
            {allFiltered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {allFiltered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-5xl">🔍</span>
                <p className="mt-4 text-sm text-muted-foreground">No products found.</p>
              </div>
            )}
          </div>
        )}

        {!search && !vegOnly && !nonVegOnly && sort === "default" && (
          <div className="mt-8 space-y-12">
            {categorySections.map((cat) => (
              <div key={cat.slug} ref={(el) => { categoryRefs.current[cat.slug] = el; }}>
                <CategoryBanner name={cat.name} description={cat.description || ""} emoji={cat.icon ?? "📦"} image={cat.image} />
                {cat.products.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {cat.products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
                  </div>
                ) : (
                  <div className="mt-4 text-center py-8 text-sm text-muted-foreground">No products in this category yet.</div>
                )}
              </div>
            ))}
            {categorySections.length === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl">🛒</span>
                <p className="mt-4 text-sm text-muted-foreground">No categories yet. Add some from the admin panel!</p>
                <Link to="/admin" className="mt-3 inline-block text-sm text-primary hover:underline">Go to Admin</Link>
              </div>
            )}
          </div>
        )}
      </div>
      <FloatingCart />
    </div>
  );
}
