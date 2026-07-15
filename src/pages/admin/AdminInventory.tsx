// MB Crunchy — Admin Inventory Management
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react";
import AdminStatsCard from "@/components/admin/AdminStatsCard";

export default function AdminInventory() {
  const products = useQuery(api.products.list, {});
  const lowStock = products?.filter(p => p.stock !== undefined && p.stock <= (p.lowStockLimit ?? 5)) ?? [];
  const outOfStock = products?.filter(p => p.stock !== undefined && p.stock <= 0) ?? [];
  const inStock = products?.filter(p => p.stock !== undefined && p.stock > (p.lowStockLimit ?? 5)) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground">{products?.length ?? 0} products tracked</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AdminStatsCard label="In Stock" value={inStock.length} icon={Package} color="bg-emerald-50 text-emerald-600" />
        <AdminStatsCard label="Low Stock" value={lowStock.length} icon={AlertTriangle} color="bg-amber-50 text-amber-600" />
        <AdminStatsCard label="Out of Stock" value={outOfStock.length} icon={TrendingDown} color="bg-red-50 text-red-600" />
        <AdminStatsCard label="Total Products" value={products?.length ?? 0} icon={TrendingUp} color="bg-blue-50 text-blue-600" />
      </div>

      {/* Low Stock Alerts */}
      <div className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-bold">Low Stock Alerts</h2>
        </div>
        {lowStock.length > 0 ? (
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p._id} className="flex items-center justify-between rounded-xl bg-amber-50/50 px-4 py-3 border border-amber-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.images?.[0] ?? "📦"}</span>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku ?? "No SKU"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}>
                    {p.stock ?? 0} left
                  </p>
                  <p className="text-[10px] text-muted-foreground">Limit: {p.lowStockLimit ?? 5}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">All products are well-stocked! 🎉</p>
        )}
      </div>

      {/* Stock list */}
      <div className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm">
        <h2 className="text-lg font-bold mb-4">All Stock</h2>
        <div className="space-y-2">
          {(products ?? []).sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0)).map(p => (
            <div key={p._id} className="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{p.images?.[0] ?? "📦"}</span>
                <p className="text-sm font-medium">{p.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground capitalize">{p.businessType}</span>
                <div className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  (p.stock ?? 0) <= 0 ? "bg-red-50 text-red-700" :
                  (p.stock ?? 0) <= (p.lowStockLimit ?? 5) ? "bg-amber-50 text-amber-700" :
                  "bg-emerald-50 text-emerald-700"
                }`}>
                  {p.stock ?? 0} units
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
