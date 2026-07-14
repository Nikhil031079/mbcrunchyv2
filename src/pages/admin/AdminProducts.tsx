// MB Crunchy — Admin Products Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye, CheckCircle, XCircle } from "lucide-react";

export default function AdminProducts() {
  const products = useQuery(api.products.list, {});
  const updateStatus = useMutation(api.products.updateStatus);
  const removeProduct = useMutation(api.products.remove);
  const duplicateProduct = useMutation(api.products.duplicate);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = products?.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p._id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleBulkAction = async (status: "active" | "inactive" | "draft") => {
    await updateStatus({ ids: Array.from(selected) as any, status });
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search + Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            <button onClick={() => handleBulkAction("active")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">Activate</button>
            <button onClick={() => handleBulkAction("inactive")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">Deactivate</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="w-10 px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-border" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Status</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(product._id)} onChange={() => toggleOne(product._id)} className="rounded border-border" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">{product.images?.[0] ?? "📦"}</div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku ?? "No SKU"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{product.businessType}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">₹{product.price}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock !== undefined && product.stock <= 5 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                      {product.stock ?? "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      product.status === "active" ? "bg-emerald-50 text-emerald-700" :
                      product.status === "inactive" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {product.status === "active" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => duplicateProduct({ id: product._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Duplicate"><Copy className="h-4 w-4" /></button>
                      <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => removeProduct({ id: product._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
