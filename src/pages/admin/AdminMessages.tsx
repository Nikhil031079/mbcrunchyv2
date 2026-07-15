// MB Crunchy — Admin Contact Messages
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, Trash2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminMessages() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const messages = useQuery(api.content.listContactMessages, {});
  const markRead = useMutation(api.content.markAsRead);
  const remove = useMutation(api.content.removeContactMessage);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
    markRead({ id: id as any });
  };

  const unreadCount = messages?.filter(m => !m.read).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-sm text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread` : "All read"}</p>
        </div>
      </div>

      {!messages ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white border border-border/60 p-4 animate-pulse"><div className="h-4 bg-muted rounded w-3/4" /></div>
        ))}</div>
      ) : messages.length === 0 ? (
        <EmptyState title="No messages yet" message="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg._id} className={`rounded-2xl bg-white border shadow-sm overflow-hidden transition-all ${!msg.read ? "border-primary/20 ring-1 ring-primary/10" : "border-border/60"}`}>
              <button onClick={() => toggle(msg._id)} className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${!msg.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{msg.name}</p>
                    <p className="text-xs text-muted-foreground">{msg.email} {msg.phone ? `• ${msg.phone}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  {!msg.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  {expanded.has(msg._id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>
              {expanded.has(msg._id) && (
                <div className="border-t border-border/40 px-4 py-4 bg-muted/10">
                  {msg.subject && <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{msg.subject}</p>}
                  <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {!msg.read && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                    <button onClick={() => setDeleteId(msg._id)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) remove({ id: deleteId as any }); setDeleteId(null); }}
        title="Delete Message" message="Delete this contact message permanently?" confirmLabel="Delete" />
    </div>
  );
}
