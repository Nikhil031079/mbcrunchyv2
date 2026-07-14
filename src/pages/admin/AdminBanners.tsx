// MB Crunchy — Admin Banners Management (with Image Upload)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminBanners() {
  const banners = useQuery(api.content.listBanners, {});
  const createBanner = useMutation(api.content.createBanner);
  const updateBanner = useMutation(api.content.updateBanner);
  const remove = useMutation(api.content.removeBanner);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const sorted = (banners ?? []).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

  const openCreate = () => { setForm({ title: "", subtitle: "", image: "", link: "", businessType: "both", sortOrder: 0, status: "active" }); setModal({ open: true }); };
  const openEdit = (b: any) => { setForm(b); setModal({ open: true, edit: b }); };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const data = { title: form.title, subtitle: form.subtitle || undefined, image: form.image || undefined, link: form.link || undefined, businessType: form.businessType || "both", sortOrder: form.sortOrder || undefined, status: form.status };
      if (modal.edit) { await updateBanner({ id: modal.edit._id, ...data } as any); toast.success("Banner updated"); }
      else { await createBanner(data as any); toast.success("Banner created"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };
  const handleDelete = async (id: string) => { try { await remove({ id: id as any }); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Banners</h1><p className="text-sm text-muted-foreground">{sorted.length} banners</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"><Plus className="h-4 w-4" /> Add Banner</button>
      </div>

      {sorted.length === 0 ? <div className="text-center py-12 text-sm text-muted-foreground">No banners yet.</div> : (
        <div className="space-y-3">
          {sorted.map(b => (
            <div key={b._id} className="group rounded-2xl bg-white border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-all">
              {b.image && <div className="h-28 bg-muted"><img src={b.image} alt={b.title} className="h-full w-full object-cover" /></div>}
              <div className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{b.subtitle}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-muted-foreground rounded bg-muted px-1.5 py-0.5 capitalize">{b.businessType}</span>
                    {b.link && <span className="text-[10px] text-muted-foreground">→ {b.link}</span>}
                  </div>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${b.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{b.status}</span>
                <span className="text-[10px] text-muted-foreground">#{b.sortOrder ?? "—"}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(b._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()} style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-border/60">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Create"} Banner</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUpload label="Banner Image" value={form.image || ""} onChange={(v) => setForm({...form, image: typeof v === "string" ? v : v[0] || ""})} multiple={false} maxFiles={1} />
              <div className="space-y-1.5"><label className="text-[10px] font-semibold uppercase text-muted-foreground">Title *</label><input value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})} placeholder="Banner title" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-semibold uppercase text-muted-foreground">Subtitle</label><input value={form.subtitle || ""} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="Banner subtitle" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-semibold uppercase text-muted-foreground">Business Type</label><select value={form.businessType || "both"} onChange={e => setForm({...form, businessType: e.target.value})} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="both">Both</option><option value="kitchen">Kitchen</option><option value="mart">Mart</option></select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-semibold uppercase text-muted-foreground">Sort Order</label><input type="number" value={form.sortOrder || 0} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-semibold uppercase text-muted-foreground">Link URL</label><input value={form.link || ""} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://example.com/offer" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-semibold uppercase text-muted-foreground">Status</label><select value={form.status || "active"} onChange={e => setForm({...form, status: e.target.value})} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-border/60">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
