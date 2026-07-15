// MB Crunchy — Admin Serving Types Management
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminServingTypes() {
  const servingTypes = useQuery(api.products_extras.listServingTypes, {});
  const create = useMutation(api.products_extras.createServingType);
  const update = useMutation(api.products_extras.updateServingType);
  const remove = useMutation(api.products_extras.removeServingType);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({ name: "", displayName: "", description: "", businessType: "both", sortOrder: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) setModal({ open: false }); };
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const openCreate = () => { setForm({ name: "", displayName: "", description: "", businessType: "both", sortOrder: 0, isActive: true }); setModal({ open: true }); };
  const openEdit = (s: any) => { setForm(s); setModal({ open: true, edit: s }); };

  const handleSave = async () => {
    if (!form.name || !form.displayName) { toast.error("Name and display name required"); return; }
    setSaving(true);
    try {
      const data = { name: form.name, displayName: form.displayName, description: form.description || undefined, businessType: form.businessType, sortOrder: form.sortOrder || 0, isActive: form.isActive };
      if (modal.edit) { await update({ id: modal.edit._id, ...data } as any); toast.success("Updated"); }
      else { await create(data as any); toast.success("Created"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const defaultTypes = [
    { name: "piece", displayName: "Piece", businessType: "kitchen" },
    { name: "plate", displayName: "Plate", businessType: "kitchen" },
    { name: "half-plate", displayName: "Half Plate", businessType: "kitchen" },
    { name: "full-plate", displayName: "Full Plate", businessType: "kitchen" },
    { name: "bowl", displayName: "Bowl", businessType: "kitchen" },
    { name: "cup", displayName: "Cup", businessType: "kitchen" },
    { name: "glass", displayName: "Glass", businessType: "kitchen" },
    { name: "box", displayName: "Box", businessType: "both" },
    { name: "packet", displayName: "Packet", businessType: "both" },
    { name: "small", displayName: "Small", businessType: "kitchen" },
    { name: "medium", displayName: "Medium", businessType: "kitchen" },
    { name: "large", displayName: "Large", businessType: "kitchen" },
    { name: "regular", displayName: "Regular", businessType: "both" },
    { name: "family-pack", displayName: "Family Pack", businessType: "kitchen" },
    { name: "kg", displayName: "Kg", businessType: "mart" },
    { name: "gram", displayName: "Gram", businessType: "mart" },
    { name: "litre", displayName: "Litre", businessType: "mart" },
    { name: "ml", displayName: "ml", businessType: "mart" },
    { name: "pcs", displayName: "Pcs", businessType: "mart" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Serving Types</h1>
          <p className="text-sm text-muted-foreground">{servingTypes?.length ?? 0} serving types</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Serving Type
        </button>
      </div>

      <details className="rounded-2xl bg-white border border-border/60 shadow-sm">
        <summary className="px-5 py-3 text-sm font-medium cursor-pointer hover:bg-muted/20 rounded-2xl">Quick-add common serving types ({defaultTypes.length} presets)</summary>
        <div className="px-5 pb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {defaultTypes.map(dt => {
            const exists = servingTypes?.find((s: any) => s.name === dt.name);
            return (
              <button key={dt.name} disabled={!!exists}
                onClick={async () => { try { await create({ ...dt, description: "", sortOrder: 0, isActive: true } as any); toast.success(`Added ${dt.displayName}`); } catch (e: any) { toast.error(e.message); }}}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${exists ? "bg-muted/20 text-muted-foreground/40 border-muted cursor-not-allowed" : "border-border/60 hover:border-primary hover:text-primary hover:bg-primary/5"}`}>
                {exists ? "✓ " : "+ "}{dt.displayName}
                <span className="block text-[9px] text-muted-foreground/60">{dt.businessType}</span>
              </button>
            );
          })}
        </div>
      </details>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Display Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Business</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Status</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(servingTypes ?? []).map((s: any) => (
                <tr key={s._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px]">{s.name}</td>
                  <td className="px-4 py-3 font-medium">{s.displayName}</td>
                  <td className="px-4 py-3 capitalize">{s.businessType}</td>
                  <td className="px-4 py-3">{s.sortOrder ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${s.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{s.isActive ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                      <button onClick={async () => { try { await remove({ id: s._id as any }); toast.success("Deleted"); } catch(e: any) { toast.error(e.message); }}} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(servingTypes ?? []).length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No serving types configured.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-border/60">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Add"} Serving Type</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="piece" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Display Name *</label>
                  <input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} placeholder="1 Piece" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Business Type</label>
                  <select value={form.businessType} onChange={e => setForm({...form, businessType: e.target.value})} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                    <option value="kitchen">Kitchen</option><option value="mart">Mart</option><option value="both">Both</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border/60 px-3 py-2 hover:bg-muted/20">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="rounded border-border" />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-border/60">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />} {modal.edit ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
