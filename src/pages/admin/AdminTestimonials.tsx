// MB Crunchy — Admin Testimonials Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";

export default function AdminTestimonials() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const testimonials = useQuery(api.content.listTestimonials, {});
  const remove = useMutation(api.content.removeTestimonial);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-sm text-muted-foreground">{testimonials?.length ?? 0} testimonials</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {!testimonials ? (
        <TableSkeleton rows={4} cols={4} />
      ) : testimonials.length === 0 ? (
        <EmptyState title="No testimonials yet" message="Add customer testimonials to build trust on the homepage." action={{ label: "Add Testimonial", onClick: () => {} }} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(t => (
            <div key={t._id} className="group rounded-2xl bg-white border border-border/60 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.comment}"</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    {t.city && <p className="text-xs text-muted-foreground">{t.city}</p>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(t._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${t.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove({ id: deleteId as any }); setDeleteId(null); }}
        title="Delete Testimonial" message="Delete this testimonial permanently?" confirmLabel="Delete" />
    </div>
  );
}
