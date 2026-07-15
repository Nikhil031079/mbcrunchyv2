// MB Crunchy — Admin Newsletter Subscribers
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, Trash2, Download } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";

export default function AdminNewsletter() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const subscribers = useQuery(api.content.listSubscribers, {});
  const remove = useMutation(api.content.removeSubscriber);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground">{subscribers?.length ?? 0} active subscribers</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-all">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {!subscribers ? (
        <TableSkeleton rows={5} cols={3} />
      ) : subscribers.length === 0 ? (
        <EmptyState title="No subscribers yet" message="Newsletter signups will appear here when customers subscribe." />
      ) : (
        <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Subscribed On</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Status</th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Subscribed</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDeleteId(sub._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove({ id: deleteId as any }); setDeleteId(null); }}
        title="Remove Subscriber" message="Remove this subscriber from the list?" confirmLabel="Remove" variant="warning" />
    </div>
  );
}
