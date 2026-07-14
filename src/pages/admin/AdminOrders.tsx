import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700", accepted: "bg-blue-50 text-blue-700",
  preparing: "bg-purple-50 text-purple-700", ready: "bg-cyan-50 text-cyan-700",
  "out-for-delivery": "bg-indigo-50 text-indigo-700", completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminOrders() {
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const orders = useQuery(api.orders.list, {});
  const updateStatus = useMutation(api.orders.updateStatus);

  const filtered = (orders ?? []).filter(o =>
    (!filter || o.status === filter) &&
    (!search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase()))
  );

  const statuses = ["pending", "accepted", "preparing", "ready", "out-for-delivery", "completed", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} orders</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order number or customer..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button onClick={() => setFilter("")} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${!filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>All</button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{s}</button>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Items</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Total</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Payment</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs">{order.orderNumber}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customerName ?? "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{order.customerPhone ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.items.length} items</td>
                  <td className="px-4 py-3 font-semibold">₹{order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[order.status] ?? ""}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground capitalize">{order.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {statuses.slice(0, -1).map(s => (
                        order.status === s && (
                          <button key={s} onClick={() => updateStatus({ id: order._id, status: statuses[statuses.indexOf(s) + 1] as any })}
                            className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors">
                            {statuses[statuses.indexOf(s) + 1]}
                          </button>
                        )
                      ))}
                      {order.status !== "cancelled" && order.status !== "completed" && (
                        <button onClick={() => updateStatus({ id: order._id, status: "cancelled" })}
                          className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
