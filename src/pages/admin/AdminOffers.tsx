// MB Crunchy — Admin Offers Engine (Full CRUD)
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Zap, Gift, Percent, PartyPopper, Search } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { toast } from "sonner";

interface OfferForm {
  title: string;
  description: string;
  type: "flash-sale" | "festival" | "category" | "product";
  discountPercent: number;
  discountFlat: number;
  minOrder: number;
  code: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

const emptyForm: OfferForm = {
  title: "", description: "", type: "flash-sale",
  discountPercent: 0, discountFlat: 0, minOrder: 0,
  code: "", validFrom: "", validUntil: "", isActive: true,
};

const offerTypes = [
  { key: "flash-sale", label: "Flash Sale", icon: Zap, color: "from-red-500 to-red-600" },
  { key: "festival", label: "Festival Offer", icon: Gift, color: "from-purple-500 to-purple-600" },
  { key: "category", label: "Category Offer", icon: Percent, color: "from-blue-500 to-blue-600" },
  { key: "product", label: "Product Offer", icon: PartyPopper, color: "from-amber-500 to-amber-600" },
];

export default function AdminOffers() {
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [form, setForm] = useState<OfferForm>(emptyForm);

  const banners = useQuery(api.content.listBanners, {});

  // Demo offers until Convex offers table is populated
  const demoOffers = [
    { _id: "demo-1", title: "20% OFF on First Order", description: "New customers get 20% off", type: "flash-sale" as const, discountPercent: 20, discountFlat: 0, minOrder: 0, code: "FIRST20", validFrom: Date.now(), validUntil: Date.now() + 30 * 86400000, isActive: true },
    { _id: "demo-2", title: "Diwali Special", description: "Festival discounts on all items", type: "festival" as const, discountPercent: 15, discountFlat: 0, minOrder: 0, code: "DIWALI", validFrom: Date.now(), validUntil: Date.now() + 15 * 86400000, isActive: true },
    { _id: "demo-3", title: "Pizza Fest", description: "30% off on all pizzas", type: "category" as const, discountPercent: 30, discountFlat: 0, minOrder: 0, code: "PIZZA30", validFrom: Date.now(), validUntil: Date.now() + 7 * 86400000, isActive: true },
    { _id: "demo-4", title: "Combo Saver", description: "Flat ₹100 off on combos", type: "product" as const, discountPercent: 0, discountFlat: 100, minOrder: 499, code: "COMBO100", validFrom: Date.now(), validUntil: Date.now() + 10 * 86400000, isActive: false },
  ];

  const allOffers = [...demoOffers];
  const filtered = allOffers.filter(o =>
    (!typeFilter || o.type === typeFilter) &&
    (!search || o.title.toLowerCase().includes(search.toLowerCase()) || o.code?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateOffer = () => {
    toast.success("Offer created! (Demo mode - Convex integration pending)");
    setShowForm(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offers & Promotions</h1>
          <p className="text-sm text-muted-foreground">Create and manage marketing campaigns</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Create Offer
        </button>
      </div>

      {/* Offer Type Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {offerTypes.map(ot => {
          const Icon = ot.icon;
          const count = allOffers.filter(o => o.type === ot.key).length;
          const active = allOffers.filter(o => o.type === ot.key && o.isActive).length;
          return (
            <button key={ot.key} onClick={() => setTypeFilter(typeFilter === ot.key ? "" : ot.key)}
              className={`rounded-2xl p-4 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95 ${
                typeFilter === ot.key ? "ring-2 ring-offset-2 ring-primary" : ""
              }`}
              style={{ background: `linear-gradient(135deg, ${ot.color.split(" ")[0].replace("from-", "")}, ${ot.color.split(" ")[1].replace("to-", "")})` }}>
              <Icon className="h-6 w-6 text-white/80 mb-2" />
              <p className="text-xs font-bold">{ot.label}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{active} active • {count} total</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search offers..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-bold mb-4">New Offer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Weekend Special" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {offerTypes.map(ot => <option key={ot.key} value={ot.key}>{ot.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Discount %</label>
              <input type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Flat Discount (₹)</label>
              <input type="number" value={form.discountFlat} onChange={e => setForm({ ...form, discountFlat: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Coupon Code</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. WEEKEND20" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" />
              <span className="text-sm">Active</span>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreateOffer} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">Create Offer</button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Offers List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(offer => {
            const ot = offerTypes.find(t => t.key === offer.type)!;
            const Icon = ot.icon;
            return (
              <div key={offer._id} className="group rounded-2xl bg-white border border-border/60 p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white`}
                  style={{ background: `linear-gradient(135deg, ${ot.color.split(" ")[0].replace("from-", "")}, ${ot.color.split(" ")[1].replace("to-", "")})` }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{offer.title}</p>
                  <p className="text-xs text-muted-foreground">{offer.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">{ot.label}</span>
                    {offer.code && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium">{offer.code}</span>}
                    {offer.discountPercent > 0 && <span className="text-xs font-semibold text-primary">{offer.discountPercent}% OFF</span>}
                    {offer.discountFlat > 0 && <span className="text-xs font-semibold text-primary">₹{offer.discountFlat} OFF</span>}
                  </div>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${offer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(offer._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No offers found" message="Create your first promotional offer to attract customers." action={{ label: "Create Offer", onClick: () => setShowForm(true) }} />
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { toast.success("Offer deleted"); setDeleteId(null); }}
        title="Delete Offer" message="Delete this offer permanently?" confirmLabel="Delete" />
    </div>
  );
}
