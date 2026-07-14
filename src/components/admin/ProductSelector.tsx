// MB Crunchy — Reusable Product Selector
// Used in Combos, Party Packs: searchable multi-select with quantity per product
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Plus, Minus, Check, Package, X } from "lucide-react";

interface ProductSelection {
  productId: string;
  quantity: number;
}

interface ProductSelectorProps {
  value: ProductSelection[];
  onChange: (selections: ProductSelection[]) => void;
  businessType?: "kitchen" | "mart";
  label?: string;
}

export default function ProductSelector({
  value,
  onChange,
  businessType,
  label = "Select Products",
}: ProductSelectorProps) {
  const products = useQuery(api.products.list, { businessType, status: "active" });
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    return list.slice(0, 30);
  }, [products, search]);

  const selectedIds = new Set(value.map(v => v.productId));

  const getQuantity = (productId: string) => {
    return value.find(v => v.productId === productId)?.quantity ?? 1;
  };

  const toggleProduct = (productId: string) => {
    if (selectedIds.has(productId)) {
      onChange(value.filter(v => v.productId !== productId));
    } else {
      onChange([...value, { productId, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    onChange(value.map(v => v.productId === productId ? { ...v, quantity: qty } : v));
  };

  // Compute totals
  const totalMrp = value.reduce((sum, sel) => {
    const product = products?.find(p => p._id === sel.productId);
    return sum + (product?.mrp ?? product?.price ?? 0) * sel.quantity;
  }, 0);

  const selectedProducts = value.map(sel => {
    const product = products?.find(p => p._id === sel.productId);
    return { ...sel, product };
  }).filter(s => s.product);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase text-muted-foreground">{label}</label>
      <p className="text-[10px] text-muted-foreground">{value.length} product{(value.length !== 1) ? "s" : ""} selected — MRP ₹{totalMrp}</p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-border bg-white py-2 pl-8 pr-3 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        {showDropdown && search && (
          <button
            type="button"
            onClick={() => setShowDropdown(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="rounded-xl border border-border/60 bg-white shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              {search ? "No products found" : "No products available"}
            </div>
          ) : (
            filtered.map(p => (
              <button
                key={p._id}
                type="button"
                onClick={() => { toggleProduct(p._id); if (!selectedIds.has(p._id)) setSearch(""); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/20 transition-colors text-xs border-b border-border/20 last:border-0 ${
                  selectedIds.has(p._id) ? "bg-primary/5" : ""
                }`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  selectedIds.has(p._id) ? "bg-primary border-primary text-white" : "border-border"
                }`}>
                  {selectedIds.has(p._id) && <Check className="h-3 w-3" />}
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-[10px]">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="h-full w-full rounded-md object-cover" />
                  ) : (
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-[9px] text-muted-foreground">₹{p.price} • Stock: {p.stock ?? "N/A"}</p>
                </div>
                <span className="text-[9px] text-muted-foreground capitalize">{p.businessType}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Selected products with quantities */}
      {selectedProducts.length > 0 && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {selectedProducts.map(({ productId, quantity, product }) => (
            <div key={productId} className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/10 p-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] overflow-hidden">
                {product!.images?.[0] ? (
                  <img src={product!.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{product!.name}</p>
                <p className="text-[9px] text-muted-foreground">₹{product!.price} each</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(productId, quantity - 1)}
                  disabled={quantity <= 1}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-border/60 hover:bg-muted disabled:opacity-30"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-xs font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(productId, quantity + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-border/60 hover:bg-muted"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggleProduct(productId)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
