// MB Crunchy — Admin Offers Management
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import { Percent, Zap, Gift, PartyPopper } from "lucide-react";

export default function AdminOffers() {
  const offers = useQuery(api.content.listBanners, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offers & Promotions</h1>
          <p className="text-sm text-muted-foreground">Manage flash sales, festival offers, and promotions</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Create Offer
        </button>
      </div>

      {/* Placeholder - Convex offers table exists in schema */}
      <div className="rounded-2xl bg-white border border-border/60 p-12 text-center shadow-sm">
        <span className="text-5xl">🏷️</span>
        <h3 className="mt-4 text-lg font-semibold">Offer Management</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Create flash sales, festival offers, category-specific and product-specific promotions.
          Set validity dates, discount percentages, and minimum order values.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
          {[
            { label: "Flash Sales", icon: Zap, color: "bg-red-50 text-red-600" },
            { label: "Festival Offers", icon: Gift, color: "bg-purple-50 text-purple-600" },
            { label: "Category Offers", icon: Percent, color: "bg-blue-50 text-blue-600" },
            { label: "Product Offers", icon: PartyPopper, color: "bg-amber-50 text-amber-600" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-border/60 p-4 text-center hover:shadow-sm transition-all">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} mx-auto mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
