// MB Crunchy — Admin FAQs Management
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";

export default function AdminFaqs() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const faqs = useQuery(api.content.listFaqs, {});
  const createFaq = useMutation(api.content.createFaq);
  const updateFaq = useMutation(api.content.updateFaq);
  const remove = useMutation(api.content.removeFaq);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({});
  const [initialForm, setInitialForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isFormDirty = useMemo(() => {
    if (!modal.open) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm, modal.open]);

  const safeClose = () => {
    if (isFormDirty) { setShowConfirm(true); }
    else { setModal({ open: false }); document.body.style.overflow = ""; }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.open && !saving) {
        if (isFormDirty) { setShowConfirm(true); }
        else { setModal({ open: false }); document.body.style.overflow = ""; }
      }
    };
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving, isFormDirty]);

  const toggle = (id: string) => { const next = new Set(expanded); if (next.has(id)) next.delete(id); else next.add(id); setExpanded(next); };
  const openCreate = () => { const v = { question: "", answer: "", category: "", order: 0, status: "active" }; setForm({...v}); setInitialForm({...v}); setModal({ open: true }); };
  const openEdit = (f: any) => { setForm({...f}); setInitialForm({...f}); setModal({ open: true, edit: f }); };

  const handleSave = async () => {
    if (!form.question || !form.answer) { toast.error("Question and answer are required"); return; }
    setSaving(true);
    try {
      const data = { question: form.question, answer: form.answer, category: form.category || undefined, order: form.order || undefined, status: form.status };
      if (modal.edit) { await updateFaq({ id: modal.edit._id, ...data } as any); toast.success("FAQ updated"); }
      else { await createFaq(data as any); toast.success("FAQ created"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };
  const handleDelete = async (id: string) => { try { await remove({ id: id as any }); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">FAQs</h1><p className="text-sm text-muted-foreground">{faqs?.length ?? 0} questions</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"><Plus className="h-4 w-4" /> Add FAQ</button>
      </div>
      <div className="space-y-2">
        {(faqs ?? []).map(faq => (
          <div key={faq._id} className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
            <button onClick={() => toggle(faq._id)} className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3"><span className="text-lg">❓</span><span className="font-medium text-sm">{faq.question}</span></div>
              <div className="flex items-center gap-2">
                {faq.category && <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{faq.category}</span>}
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${faq.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{faq.status}</span>
                <button onClick={(e) => { e.stopPropagation(); openEdit(faq); }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(faq._id); }} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                {expanded.has(faq._id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </button>
            {expanded.has(faq._id) && <div className="border-t border-border/40 px-4 py-3 bg-muted/10"><p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p></div>}
          </div>
        ))}
        {(faqs ?? []).length === 0 && <div className="text-center py-12 text-sm text-muted-foreground">No FAQs yet.</div>}
      </div>
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) safeClose(); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Add"} FAQ</h2>
              <button onClick={() => safeClose()} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Question *</label><input value={form.question || ""} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Frequently asked question" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Answer *</label><textarea value={form.answer || ""} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Detailed answer" rows={4} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Category</label><input value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="General" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Order</label><input type="number" value={form.order || 0} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Status</label><select value={form.status || "active"} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/60 shrink-0 bg-white">
              <button onClick={() => safeClose()} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); setModal({ open: false }); document.body.style.overflow = ""; }} title="Unsaved Changes" message="You have unsaved changes. Are you sure you want to close?" confirmLabel="Discard Changes" variant="warning" />
    </div>
  );
}
