// MB Crunchy — Admin Offers Engine (Convex CRUD)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Zap, Gift, Percent, PartyPopper, Search, Loader2, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { toast } from "sonner";

const offerTypes = [
  { key: "flash-sale", label: "Flash Sale", icon: Zap, color: "from-red-500 to-red-600" },
  { key: "festival", label: "Festival Offer", icon: Gift, color: "from-purple-500 to-purple-600" },
  { key: "category", label: "Category Offer", icon: Percent, color: "from-blue-500 to-blue-600" },
  { key: "product", label: "Product Offer", icon: PartyPopper, color: "from-amber-500 to-amber-600" },
];

export default function AdminOffers() {
  const offers = useQuery(api.offers.list, {});
  const createOffer = useMutation(api.offers.create);
  const updateOffer = useMutation(api.offers.update);
  const removeOffer = useMutation(api.offers.remove);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const allOffers = offers ?? [];
  const filtered = allOffers.filter(o =>
    (!typeFilter || o.type === typeFilter) &&
    (!search || o.title.toLowerCase().includes(search.toLowerCase()) || (o.code || "").toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => {
    setForm({ title: "", description: "", type: "flash-sale", discountPercent: 0, discountFlat: 0, minOrder: 0, code: "", validFrom: "", validUntil: "", isActive: true });
    setModal({ open: true });
  };

  const openEdit = (offer: any) => {
    setForm({
      title: offer.title, description: offer.description || "", type: offer.type,
      discountPercent: offer.discountPercent || 0, discountFlat: offer.discountFlat || 0,
      minOrder: offer.minOrder || 0, code: offer.code || "",
      validFrom: new Date(offer.validFrom).toISOString().split("T")[0],
      validUntil: new Date(offer.validUntil).toISOString().split("T")[0],
      isActive: offer.isActive,
    });
    setModal({ open: true, edit: offer });
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const now = form.validFrom ? new Date(form.validFrom).getTime() : Date.now();
      const until = form.validUntil ? new Date(form.validUntil).getTime() : Date.now() + 30 * 86400000;
      const data = {
        title: form.title, description: form.description || undefined,
        type: form.type, discountPercent: form.discountPercent || undefined,
        discountFlat: form.discountFlat || undefined, minOrder: form.minOrder || undefined,
        code: form.code || undefined, image: undefined,
        validFrom: now, validUntil: until, isActive: form.isActive,
      };
      if (modal.edit) { await updateOffer({ id: modal.edit._id, ...data }); toast.success("Offer updated"); }
      else { await createOffer(data as any); toast.success("Offer created"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message || "Failed to save"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await removeOffer({ id: deleteId as any }); toast.success("Offer deleted"); setDeleteId(null); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offers & Promotions</h1>
          <p className="text-sm text-muted-foreground">{(offers ?? []).length} offers</p>
        </div>
        <button onClick={openCreate}
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

      {/* Offers List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(offer => {
            const ot = offerTypes.find(t => t.key === offer.type) || offerTypes[0];
            const Icon = ot.icon;
            return (
              <div key={offer._id} className="group rounded-2xl bg-white border border-border/60 p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white`}
                  style={{ background: `linear-gradient(135deg, ${ot.color.split(" ")[0].replace("from-", "")}, ${ot.color.split(" ")[1].replace("to-", "")})` }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{offer.title}</p>
                  {offer.description && <p className="text-xs text-muted-foreground">{offer.description}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">{ot.label}</span>
                    {offer.code && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium">{offer.code}</span>}
                    {offer.discountPercent ? <span className="text-xs font-semibold text-primary">{offer.discountPercent}% OFF</span> : null}
                    {offer.discountFlat ? <span className="text-xs font-semibold text-primary">₹{offer.discountFlat} OFF</span> : null}
                    {offer.minOrder ? <span className="text-xs text-muted-foreground">Min: ₹{offer.minOrder}</span> : null}
                  </div>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${offer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">
                  {new Date(offer.validUntil).toLocaleDateString()}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(offer)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(offer._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No offers found" message="Create your first promotional offer to attract customers." action={{ label: "Create Offer", onClick: openCreate }} />
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Offer" message="Delete this offer permanently?" confirmLabel="Delete" />

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()} style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-border/60">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Create"} Offer</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Title *</label>
                  <input value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Weekend Special"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Type</label>
                  <select value={form.type || "flash-sale"} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    {offerTypes.map(ot => <option key={ot.key} value={ot.key}>{ot.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Description</label>
                <textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Discount %</label>
                  <input type="number" value={form.discountPercent || 0} onChange={e => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })} min={0} max={100}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Flat Discount (₹)</label>
                  <input type="number" value={form.discountFlat || 0} onChange={e => setForm({ ...form, discountFlat: parseInt(e.target.value) || 0 })} min={0}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Min Order (₹)</label>
                  <input type="number" value={form.minOrder || 0} onChange={e => setForm({ ...form, minOrder: parseInt(e.target.value) || 0 })} min={0}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Coupon Code</label>
                  <input value={form.code || ""} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="WEEKEND20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Valid From</label>
                  <input type="date" value={form.validFrom || ""} onChange={e => setForm({ ...form, validFrom: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Valid Until</label>
                  <input type="date" value={form.validUntil || ""} onChange={e => setForm({ ...form, validUntil: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-border/60 p-3 cursor-pointer hover:bg-muted/20">
                <input type="checkbox" checked={form.isActive ?? true} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-border/60">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
