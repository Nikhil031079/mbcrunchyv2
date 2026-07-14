// MB Crunchy — Admin Blog Management
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminBlogs() {
  const [filter, setFilter] = useState("");
  const blogs = useQuery(api.content.listBlogs, {});
  const createBlog = useMutation(api.content.createBlog);
  const updateBlog = useMutation(api.content.updateBlog);
  const remove = useMutation(api.content.removeBlog);
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; } else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const filtered = (blogs ?? []).filter(b => !filter || b.status === filter);

  const openCreate = () => { setForm({ title: "", slug: "", content: "", excerpt: "", author: "", tags: [], status: "draft" }); setModal({ open: true }); };
  const openEdit = (b: any) => { setForm(b); setModal({ open: true, edit: b }); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error("Title and slug required"); return; }
    setSaving(true);
    try {
      const data = { title: form.title, slug: form.slug, content: form.content, excerpt: form.excerpt, author: form.author || "Admin", status: form.status };
      if (modal.edit) { await updateBlog({ id: modal.edit._id, ...data } as any); toast.success("Blog updated successfully"); }
      else { await createBlog(data as any); toast.success("Blog created successfully"); }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };
  const handleDelete = async (id: string) => { try { await remove({ id: id as any }); toast.success("Deleted successfully"); } catch (e: any) { toast.error(e.message); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Blogs</h1><p className="text-sm text-muted-foreground">{blogs?.length ?? 0} articles</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"><Plus className="h-4 w-4" /> New Post</button>
      </div>
      <div className="flex gap-2">{["", "draft", "published"].map(s => (<button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{s || "All"}</button>))}</div>
      <div className="space-y-3">
        {filtered.map(b => (<div key={b._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-2xl">📝</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{b.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{b.slug} • {b.author ?? "Unknown"} • {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}</p>
            {b.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.excerpt}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${b.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{b.status}</span>
            <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
            <button onClick={() => handleDelete(b._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>))}
        {filtered.length === 0 && <div className="text-center py-12 text-sm text-muted-foreground">No blog posts found.</div>}
      </div>
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-2xl mx-4 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Create"} Blog Post</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Title *</label><input value={form.title || ""} onChange={e => { setForm({ ...form, title: e.target.value }); if (!modal.edit) setForm((f: any) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })); }} placeholder="Post title" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Slug *</label><input value={form.slug || ""} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} placeholder="post-slug" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Author</label><input value={form.author || ""} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Admin" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Status</label><select value={form.status || "draft"} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="draft">Draft</option><option value="published">Published</option></select></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Excerpt</label><textarea value={form.excerpt || ""} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary" rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Content</label><textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your blog content here..." rows={8} className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y" /></div>
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
