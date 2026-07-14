import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";

export default function AdminCategories() {
  const categories = useQuery(api.categories.list, {});
  const remove = useMutation(api.categories.remove);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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
            <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
            <button onClick={() => remove({ id: cat._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
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
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors">Kitchen</button>
        <button className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors">Mart</button>
        <button className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-colors">Both</button>
      </div>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        {renderTree(undefined)}
        {(categories ?? []).length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
