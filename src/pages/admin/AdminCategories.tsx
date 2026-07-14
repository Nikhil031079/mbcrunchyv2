import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const categories = useQuery(api.categories.list, {});
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const remove = useMutation(api.categories.remove);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formBizType, setFormBizType] = useState<"kitchen" | "mart" | "both">("both");
  const [formParent, setFormParent] = useState<string>("");
  const [formIcon, setFormIcon] = useState("");
  const [formSort, setFormSort] = useState(0);
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setFormName(""); setFormSlug(""); setFormDesc(""); setFormBizType("both");
    setFormParent(""); setFormIcon(""); setFormSort(0); setFormStatus("active");
    setModal({ open: true });
  };

  const openEdit = (cat: any) => {
    setFormName(cat.name); setFormSlug(cat.slug); setFormDesc(cat.description || "");
    setFormBizType(cat.businessType); setFormParent(cat.parentId || "");
    setFormIcon(cat.icon || "📁"); setFormSort(cat.sortOrder || 0); setFormStatus(cat.status);
    setModal({ open: true, edit: cat });
  };

  const handleSave = async () => {
    if (!formName || !formSlug) { toast.error("Name and slug are required"); return; }
    setSaving(true);
    try {
      if (modal.edit) {
        await updateCategory({
          id: modal.edit._id,
          name: formName,
          slug: formSlug,
          description: formDesc || undefined,
          businessType: formBizType,
          parentId: formParent ? (formParent as any) : undefined,
          icon: formIcon || undefined,
          sortOrder: formSort || undefined,
          status: formStatus,
        });
        toast.success("Category updated");
      } else {
        await createCategory({
          name: formName,
          slug: formSlug,
          description: formDesc || undefined,
          businessType: formBizType,
          parentId: formParent ? (formParent as any) : undefined,
          icon: formIcon || undefined,
          sortOrder: formSort || undefined,
          status: formStatus,
        });
        toast.success("Category created");
      }
      setModal({ open: false });
    } catch (e: any) {
      toast.error(e.message || "Failed to save category");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove({ id: id as any });
      toast.success("Category deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const renderTree = (parentId: string | undefined, depth: number = 0) => {
    const children = (categories ?? []).filter(c => c.parentId === parentId).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    return children.map(cat => (
      <div key={cat._id}>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors border-b border-border/40" style={{ paddingLeft: `${16 + depth * 24}px` }}>
          <button onClick={() => toggleExpand(cat._id)} className="text-muted-foreground hover:text-foreground">
            {expanded.has(cat._id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <span className="text-lg">{cat.icon ?? "📁"}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{cat.slug} • {cat.businessType}</p>
          </div>
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${cat.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{cat.status}</span>
          <div className="flex gap-1">
            <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
            <button onClick={() => handleDelete(cat._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
        {expanded.has(cat._id) && renderTree(cat._id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">{(categories ?? []).length} categories</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        {renderTree(undefined)}
        {(categories ?? []).length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">No categories yet. Click "Add Category" to create one.</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !saving && setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit Category" : "Create Category"}</h2>
              <button onClick={() => !saving && setModal({ open: false })} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Category name" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Slug</label>
                  <input value={formSlug} onChange={e => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="category-slug" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Category description" rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Business Type</label>
                  <select value={formBizType} onChange={e => setFormBizType(e.target.value as any)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="both">Both</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="mart">Mart</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select value={formStatus} onChange={e => setFormStatus(e.target.value as any)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Parent (optional)</label>
                  <select value={formParent} onChange={e => setFormParent(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">None (Top-level)</option>
                    {(categories ?? []).filter(c => !c.parentId).map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Icon / Emoji</label>
                  <input value={formIcon} onChange={e => setFormIcon(e.target.value)} placeholder="📁" maxLength={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
                <input type="number" value={formSort} onChange={e => setFormSort(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/60">
              <button onClick={() => !saving && setModal({ open: false })} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {modal.edit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
