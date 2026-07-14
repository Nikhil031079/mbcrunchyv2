import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, ChevronRight } from "lucide-react";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const customers = useQuery(api.customers.list, {});
  const filtered = (customers ?? []).filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.phone?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} customers</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><span className="font-medium">{c.name ?? "Anonymous"}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3"><span className="capitalize text-xs">{c.role ?? "customer"}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c._creationTime ? new Date(c._creationTime).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
