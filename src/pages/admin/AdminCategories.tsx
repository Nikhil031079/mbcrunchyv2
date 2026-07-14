// MB Crunchy — Admin Categories Management (Enhanced)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminCategories() {
  const categories = useQuery(api.categories.list, {});
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const remove = useMutation(api.categories.remove);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const openCreate = () => {
    setForm({ name: "", slug: "", description: "", businessType: "both", parentId: "", image: "", banner: "", icon: "📁", sortOrder: 0, status: "active", seoTitle: "", seoDescription: "" });
    setModal({ open: true });
  };

  const openEdit = (cat: any) => {
    setForm({
      name: cat.name, slug: cat.slug, description: cat.description || "", businessType: cat.businessType,
      parentId: cat.parentId || "", image: cat.image || "", banner: cat.banner || "",
      icon: cat.icon || "📁", sortOrder: cat.sortOrder || 0, status: cat.status,
      seoTitle: cat.seoTitle || "", seoDescription: cat.seoDescription || "",
    });
    setModal({ open: true, edit: cat });
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    setSaving(true);
    try {
      const data = {
        name: form.name, slug: form.slug, description: form.description || undefined,
        businessType: form.businessType, parentId: form.parentId ? (form.parentId as any) : undefined,
        image: form.image || undefined, banner: form.banner || undefined,
        icon: form.icon || undefined, sortOrder: form.sortOrder || undefined,
        status: form.status, seoTitle: form.seoTitle || undefined, seoDescription: form.seoDescription || undefined,
      };
      if (modal.edit) { await updateCategory({ id: modal.edit._id, ...data }); toast.success("Category updated"); }
      else { await createCategory(data as any); toast.success("Category created"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message || "Failed to save"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try { await remove({ id: id as any }); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); }
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expanded); if (next.has(id)) next.delete(id); else next.add(id); setExpanded(next);
  };

  const renderTree = (parentId: string | undefined, depth: number = 0) => {
    const children = (categories ?? []).filter(c => c.parentId === parentId).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    return children.map(cat => (
      <div key={cat._id}>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors border-b border-border/40" style={{ paddingLeft: `${16 + depth * 24}px` }}>
          <button onClick={() => toggleExpand(cat._id)} className="text-muted-foreground hover:text-foreground">
            {expanded.has(cat._id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
            {cat.image ? <img src={cat.image} alt="" className="h-full w-full object-cover" /> : <span className="text-base">{cat.icon ?? "📁"}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{cat.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{cat.slug} • {cat.businessType}{cat.parentId ? " • Child" : ""}</p>
          </div>
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${cat.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{cat.status}</span>
          <span className="text-[10px] text-muted-foreground">#{cat.sortOrder ?? "—"}</span>
          <div className="flex gap-1">
            <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
            <button onClick={() => handleDelete(cat._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
        {expanded.has(cat._id) && renderTree(cat._id, depth + 1)}
      </div>
    ));
  };

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Categories</h1><p className="text-sm text-muted-foreground">{(categories ?? []).length} categories</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        {renderTree(undefined)}
        {(categories ?? []).length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">No categories yet.</div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 bg-black/40"
          onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 my-auto"
            onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-border/60 rounded-t-2xl">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit Category" : "Create Category"}</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <ImageUpload label="Category Image" value={form.image || ""} onChange={(v) => setForm({...form, image: typeof v === "string" ? v : v[0] || ""})} multiple={false} maxFiles={1} />
              <ImageUpload label="Category Banner" value={form.banner || ""} onChange={(v) => setForm({...form, banner: typeof v === "string" ? v : v[0] || ""})} multiple={false} maxFiles={1} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Name *</label>
                  <input value={form.name || ""} onChange={e => { setForm({...form, name: e.target.value}); if (!modal.edit) setForm((f: any) => ({...f, name: e.target.value, slug: slugify(e.target.value)})); }} placeholder="Category name"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Slug *</label>
                  <input value={form.slug || ""} onChange={e => setForm({...form, slug: slugify(e.target.value)})} placeholder="category-slug"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Description</label>
                <textarea value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} placeholder="Category description" rows={2}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Icon / Emoji</label>
                  <input value={form.icon || ""} onChange={e => setForm({...form, icon: e.target.value})} placeholder="📁" maxLength={2}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Sort Order</label>
                  <input type="number" value={form.sortOrder || 0} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value) || 0})}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Business Type</label>
                  <select value={form.businessType || "both"} onChange={e => setForm({...form, businessType: e.target.value})}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="both">Both</option><option value="kitchen">Kitchen</option><option value="mart">Mart</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Status</label>
                  <select value={form.status || "active"} onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Parent Category</label>
                <select value={form.parentId || ""} onChange={e => setForm({...form, parentId: e.target.value})}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">None (Top-level)</option>
                  {(categories ?? []).filter(c => !c.parentId && c._id !== modal.edit?._id).map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* SEO Fields */}
              <div className="rounded-xl border border-border/40 p-4 space-y-3">
                <h3 className="text-[10px] font-semibold uppercase text-muted-foreground">SEO</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">SEO Title</label>
                  <input value={form.seoTitle || ""} onChange={e => setForm({...form, seoTitle: e.target.value})} placeholder="SEO title (leave empty to use category name)"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">SEO Description</label>
                  <textarea value={form.seoDescription || ""} onChange={e => setForm({...form, seoDescription: e.target.value})} placeholder="SEO meta description" rows={2}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-border/60 rounded-b-2xl">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
