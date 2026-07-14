import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminCoupons() {
  const coupons = useQuery(api.coupons.list, {});
  const createCoupon = useMutation(api.coupons.create);
  const updateCoupon = useMutation(api.coupons.update);
  const remove = useMutation(api.coupons.remove);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const openCreate = () => {
    setForm({ code: "", type: "percentage", value: 10, minOrder: 0, maxDiscount: 0, usageLimit: 0, businessType: "both", isActive: true, description: "" });
    setModal({ open: true });
  };
  const openEdit = (c: any) => { setForm(c); setModal({ open: true, edit: c }); };

  const handleSave = async () => {
    if (!form.code) { toast.error("Coupon code is required"); return; }
    setSaving(true);
    try {
      const now = Date.now();
      const data = { code: form.code.toUpperCase(), type: form.type, value: form.value, minOrder: form.minOrder || undefined, maxDiscount: form.maxDiscount || undefined, usageLimit: form.usageLimit || undefined, businessType: form.businessType, validFrom: now, validUntil: now + 30 * 24 * 3600000, isActive: form.isActive, description: form.description };
      if (modal.edit) { await updateCoupon({ id: modal.edit._id, ...data }); toast.success("Coupon updated successfully"); }
      else { await createCoupon(data as any); toast.success("Coupon created successfully"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };
  const handleDelete = async (id: string) => { try { await remove({ id: id as any }); toast.success("Deleted successfully"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Coupons</h1><p className="text-sm text-muted-foreground">{coupons?.length ?? 0} coupons</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"><Plus className="h-4 w-4" /> Create Coupon</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(coupons ?? []).map(c => (
          <div key={c._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div><span className="font-mono font-bold text-lg">{c.code}</span><p className="text-xs text-muted-foreground mt-0.5">{c.description}</p></div>
              <div className="flex gap-1"><button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button><button onClick={() => handleDelete(c._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded-lg bg-primary/5 px-2 py-1 font-semibold text-primary">{c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`}</span>
              {c.minOrder ? <span className="text-xs text-muted-foreground">Min: ₹{c.minOrder}</span> : null}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Used: {c.usedCount ?? 0}/{c.usageLimit ?? "∞"}</span>
              <span className={c.isActive ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>{c.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
        {(coupons ?? []).length === 0 && <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No coupons yet.</div>}
      </div>
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Create"} Coupon</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Code *</label><input value={form.code || ""} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Type</label><select value={form.type || "percentage"} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="percentage">Percentage</option><option value="flat">Flat Amount</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Value *</label><input type="number" value={form.value || 0} onChange={e => setForm({ ...form, value: parseInt(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Business Type</label><select value={form.businessType || "both"} onChange={e => setForm({ ...form, businessType: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="both">Both</option><option value="kitchen">Kitchen</option><option value="mart">Mart</option></select></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Description</label><input value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Coupon description" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Min Order (₹)</label><input type="number" value={form.minOrder || 0} onChange={e => setForm({ ...form, minOrder: parseInt(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Max Discount (₹)</label><input type="number" value={form.maxDiscount || 0} onChange={e => setForm({ ...form, maxDiscount: parseInt(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Usage Limit</label><input type="number" value={form.usageLimit || 0} onChange={e => setForm({ ...form, usageLimit: parseInt(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-border/60 p-3 cursor-pointer hover:bg-muted/20"><input type="checkbox" checked={form.isActive ?? true} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" /><span className="text-sm font-medium">Active</span></label>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/60 shrink-0 bg-white">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update Coupon" : "Create Coupon"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
