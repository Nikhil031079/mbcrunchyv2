// MB Crunchy — Admin Banners Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Eye, GripVertical } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";

export default function AdminBanners() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const banners = useQuery(api.content.listBanners, {});
  const remove = useMutation(api.content.removeBanner);

  const sorted = (banners ?? []).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-sm text-muted-foreground">{sorted.length} banners</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      {!banners ? (
        <TableSkeleton rows={3} cols={5} />
      ) : sorted.length === 0 ? (
        <EmptyState title="No banners yet" message="Create your first banner to display promotions on the homepage." action={{ label: "Add Banner", onClick: () => {} }} />
      ) : (
        <div className="space-y-3">
          {sorted.map(banner => (
            <div key={banner._id} className="group rounded-2xl bg-white border border-border/60 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <GripVertical className="h-5 w-5 text-muted-foreground/30 cursor-grab" />
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 text-2xl border border-border/40">
                {banner.image ?? "🖼️"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{banner.title}</p>
                {banner.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{banner.subtitle}</p>}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-muted-foreground rounded bg-muted px-1.5 py-0.5 capitalize">{banner.businessType}</span>
                  {banner.link && <span className="text-[10px] text-muted-foreground">→ {banner.link}</span>}
                </div>
              </div>
              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${banner.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {banner.status}
              </span>
              <span className="text-[10px] text-muted-foreground">#{banner.sortOrder ?? "—"}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Eye className="h-4 w-4" /></button>
                <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(banner._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove({ id: deleteId as any }); setDeleteId(null); }}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
