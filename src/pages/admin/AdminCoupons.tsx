import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCoupons() {
  const coupons = useQuery(api.coupons.list, {});
  const remove = useMutation(api.coupons.remove);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">{coupons?.length ?? 0} coupons</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(coupons ?? []).map(coupon => (
          <div key={coupon._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono font-bold text-lg">{coupon.code}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>
              </div>
              <button onClick={() => remove({ id: coupon._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-lg bg-primary/5 px-2 py-1 font-semibold text-primary">{coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}</span>
              {coupon.minOrder && <span className="text-xs text-muted-foreground">Min: ₹{coupon.minOrder}</span>}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Used: {coupon.usedCount ?? 0}/{coupon.usageLimit ?? "∞"}</span>
              <span className={coupon.isActive ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>{coupon.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
        {(coupons ?? []).length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No coupons created yet.</div>
        )}
      </div>
    </div>
  );
}
