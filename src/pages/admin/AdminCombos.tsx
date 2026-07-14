import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminCombos() {
  const [tab, setTab] = useState<"combos" | "party-packs">("combos");
  const combos = useQuery(api.combos.listCombos, {});
  const packs = useQuery(api.combos.listPartyPacks, {});
  const products = useQuery(api.products.list, {});

  // Combos CRUD
  const createCombo = useMutation(api.combos.createCombo);
  const updateCombo = useMutation(api.combos.updateCombo);
  const removeCombo = useMutation(api.combos.removeCombo);
  // Party Packs CRUD
  const createPack = useMutation(api.combos.createPartyPack);
  const updatePack = useMutation(api.combos.updatePartyPack);
  const removePack = useMutation(api.combos.removePartyPack);

  const [modal, setModal] = useState<{ open: boolean; type: "combo" | "pack"; edit?: any }>({ open: false, type: "combo" });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const openCreate = (type: "combo" | "pack") => {
    setForm({ name: "", description: "", businessType: "kitchen", productIds: [], comboPrice: 0, mrp: 0, savings: 0, serves: 4, status: "active" });
    setModal({ open: true, type });
  };
  const openEdit = (type: "combo" | "pack", item: any) => {
    setForm({ ...item, productIds: item.productIds || [] });
    setModal({ open: true, type, edit: item });
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    if (!form.mrp || !form.comboPrice) { toast.error("Price is required"); return; }
    setSaving(true);
    try {
      const base = { name: form.name, description: form.description, businessType: form.businessType, productIds: form.productIds, mrp: form.mrp, status: form.status };
      if (modal.type === "combo") {
        const comboData = { ...base, comboPrice: form.comboPrice, savings: form.mrp - form.comboPrice, weight: form.weight };
        if (modal.edit) { await updateCombo({ id: modal.edit._id, ...comboData }); toast.success("Combo updated successfully"); }
        else { await createCombo(comboData as any); toast.success("Combo created successfully"); }
      } else {
        const packData = { ...base, partyPrice: form.comboPrice, savings: form.mrp - form.comboPrice, serves: form.serves || 4, weight: form.weight };
        if (modal.edit) { await updatePack({ id: modal.edit._id, ...packData }); toast.success("Party pack updated successfully"); }
        else { await createPack(packData as any); toast.success("Party pack created successfully"); }
      }
      setModal({ open: false, type: "combo" }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id: string, type: "combo" | "pack") => {
    try { if (type === "combo") await removeCombo({ id: id as any }); else await removePack({ id: id as any }); toast.success("Deleted successfully"); } catch (e: any) { toast.error(e.message); }
  };

  const items = tab === "combos" ? (combos ?? []) : (packs ?? []);
  const renderCard = (item: any, type: "combo" | "pack") => (
    <div key={item._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{type === "combo" ? "🎁" : "🎉"}</span>
        <div className="flex gap-1">
          <button onClick={() => openEdit(type, item)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
          <button onClick={() => handleDelete(item._id, type)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="font-bold">₹{type === "combo" ? item.comboPrice : item.partyPrice}</span>
          <span className="ml-2 text-xs text-muted-foreground line-through">₹{item.mrp}</span>
          <span className="ml-2 text-xs text-emerald-600 font-medium">Save ₹{item.savings}</span>
        </div>
        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
      </div>
      {type === "pack" && <p className="text-xs text-muted-foreground mt-1">Serves: {item.serves}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Combos & Party Packs</h1><p className="text-sm text-muted-foreground">{items.length} items</p></div>
        <button onClick={() => openCreate(tab === "combos" ? "combo" : "pack")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"><Plus className="h-4 w-4" /> Create {tab === "combos" ? "Combo" : "Party Pack"}</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60">
        <button onClick={() => setTab("combos")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "combos" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Combos ({combos?.length ?? 0})</button>
        <button onClick={() => setTab("party-packs")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "party-packs" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Party Packs ({packs?.length ?? 0})</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => renderCard(item, tab === "combos" ? "combo" : "pack"))}
        {items.length === 0 && <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No {tab === "combos" ? "combos" : "party packs"} yet.</div>}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Create"} {modal.type === "combo" ? "Combo" : "Party Pack"}</h2>
              <button onClick={() => { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Name *</label><input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Combo name" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Type</label><select value={form.businessType || "kitchen"} onChange={e => setForm({ ...form, businessType: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="kitchen">Kitchen</option><option value="mart">Mart</option></select></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Description</label><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">MRP (₹) *</label><input type="number" value={form.mrp || 0} onChange={e => setForm({ ...form, mrp: parseFloat(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">{modal.type === "combo" ? "Combo" : "Party"} Price (₹) *</label><input type="number" value={form.comboPrice || 0} onChange={e => setForm({ ...form, comboPrice: parseFloat(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Savings (₹)</label><input type="number" value={form.mrp - form.comboPrice || 0} disabled className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-muted/20 focus:outline-none" /></div>
              </div>
              {modal.type === "pack" && <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Serves</label><input type="number" value={form.serves || 4} onChange={e => setForm({ ...form, serves: parseInt(e.target.value) || 1 })} min={1} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>}
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Weight</label><input value={form.weight || ""} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 500g" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Status</label><select value={form.status || "active"} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/60 shrink-0 bg-white">
              <button onClick={() => { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
