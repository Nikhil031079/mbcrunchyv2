// MB Crunchy — Admin Audit Logs
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, ClipboardList, Shield } from "lucide-react";

const actionStyles: Record<string, string> = {
  create: "bg-emerald-50 text-emerald-700",
  update: "bg-blue-50 text-blue-700",
  delete: "bg-red-50 text-red-700",
  login: "bg-purple-50 text-purple-700",
  logout: "bg-gray-50 text-gray-700",
  change_password: "bg-amber-50 text-amber-700",
  reset_password: "bg-orange-50 text-orange-700",
  generate_recovery_key: "bg-cyan-50 text-cyan-700",
  use_recovery_key: "bg-pink-50 text-pink-700",
  approve: "bg-emerald-50 text-emerald-700",
  reject: "bg-red-50 text-red-700",
};

const actionLabels: Record<string, string> = {
  create: "Created", update: "Updated", delete: "Deleted",
  login: "Logged In", logout: "Logged Out",
  change_password: "Password Changed", reset_password: "Password Reset",
  generate_recovery_key: "Key Generated", use_recovery_key: "Key Used",
  approve: "Approved", reject: "Rejected",
};

export default function AdminAuditLogs() {
  const [search, setSearch] = useState("");
  const logs = useQuery(api.security.listAuditLogs, {});

  const filtered = (logs ?? []).filter(log =>
    !search || 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details?.toLowerCase().includes(search.toLowerCase()) ||
    log.entityType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} events tracked</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>All actions are permanently recorded</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search audit logs..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="space-y-1 p-4">
          {filtered.map(log => (
            <div key={log._id} className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/20 transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${actionStyles[log.action] ?? "bg-muted text-muted-foreground"}`}>
                    {actionLabels[log.action] || log.action}
                  </span>
                  <span className="text-xs font-medium">{log.entityType}</span>
                  {log.entityId && <span className="text-xs text-muted-foreground font-mono">#{log.entityId.substring(0, 8)}</span>}
                </div>
                {log.details && (
                  <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                )}
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No audit logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
