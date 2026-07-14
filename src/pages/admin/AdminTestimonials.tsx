// MB Crunchy — Admin Testimonials Management
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Star, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminTestimonials() {
  const testimonials = useQuery(api.content.listTestimonials, {});
  const createTestimonial = useMutation(api.content.createTestimonial);
  const updateTestimonial = useMutation(api.content.updateTestimonial);
  const remove = useMutation(api.content.removeTestimonial);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const openCreate = () => { setForm({ name: "", city: "", comment: "", rating: 5, status: "active" }); setModal({ open: true }); };
  const openEdit = (t: any) => { setForm(t); setModal({ open: true, edit: t }); };
  const handleSave = async () => {
    if (!form.name || !form.comment) { toast.error("Name and comment required"); return; }
    setSaving(true);
    try {
      const data = { name: form.name, city: form.city || undefined, comment: form.comment, rating: form.rating || 5, status: form.status };
      if (modal.edit) { await updateTestimonial({ id: modal.edit._id, ...data } as any); toast.success("Updated successfully"); }
      else { await createTestimonial(data as any); toast.success("Created successfully"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };
  const handleDelete = async (id: string) => { try { await remove({ id: id as any }); toast.success("Deleted successfully"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Testimonials</h1><p className="text-sm text-muted-foreground">{testimonials?.length ?? 0} testimonials</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"><Plus className="h-4 w-4" /> Add Testimonial</button>
      </div>
      {testimonials && testimonials.length === 0 ? <div className="text-center py-12 text-sm text-muted-foreground">No testimonials yet.</div> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(testimonials ?? []).map(t => (
            <div key={t._id} className="group rounded-2xl bg-white border border-border/60 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/20"}`} />))}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.comment}"</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{t.name.charAt(0)}</div>
                  <div><p className="text-sm font-semibold">{t.name}</p>{t.city && <p className="text-xs text-muted-foreground">{t.city}</p>}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(t._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3"><span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${t.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{t.status}</span></div>
            </div>
          ))}
        </div>
      )}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Name *</label><input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Customer name" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">City</label><input value={form.city || ""} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Rating</label><div className="flex gap-1">{[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}><Star className={`h-6 w-6 ${n <= (form.rating || 5) ? "fill-accent text-accent" : "text-muted-foreground/20"}`} /></button>)}</div></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Comment *</label><textarea value={form.comment || ""} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Customer testimonial" rows={3} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Status</label><select value={form.status || "active"} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/60 shrink-0 bg-white">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
