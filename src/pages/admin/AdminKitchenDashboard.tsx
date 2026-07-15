// MB Crunchy — Kitchen Dashboard (Live Orders from Convex)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, ChefHat, Package, AlertCircle, Search, UtensilsCrossed, Timer, ListChecks, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-purple-50 text-purple-700 border-purple-200",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const nextStatus: Record<string, string> = {
  pending: "accepted",
  accepted: "preparing",
  preparing: "ready",
};

function OrderCard({ order, onUpdate }: { order: any; onUpdate: (id: string, status: string) => void }) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - order.createdAt) / 60000));

  useEffect(() => {
    if (order.status === "ready" || order.status === "completed" || order.status === "cancelled") return;
    const interval = setInterval(() => setElapsed(e => e + 1), 60000);
    return () => clearInterval(interval);
  }, [order.status]);

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const isUrgent = elapsed > 15 && order.status !== "ready";
  const isOverdue = elapsed > 25 && order.status !== "ready";

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className={`rounded-2xl border-2 p-4 shadow-sm transition-all ${
        isOverdue ? "border-red-200 bg-red-50/10" :
        isUrgent ? "border-amber-200 bg-amber-50/10" :
        "border-border/60 bg-white"
      } ${order.status === "ready" ? "ring-2 ring-emerald-200" : ""}`}>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 ${
            isOverdue ? "border-red-300 bg-red-100 text-red-600" : "border-border bg-muted text-muted-foreground"
          }`}>
            {isOverdue ? <AlertCircle className="h-4 w-4" /> : <ListChecks className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-sm font-mono font-bold">{order.orderNumber?.split("-").pop() || `#${order._id.slice(-4)}`}</p>
            <p className="text-[10px] text-muted-foreground">{order.customerName || "Guest"}</p>
          </div>
        </div>
        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize border ${statusStyles[order.status] || ""}`}>
          {order.status}
        </span>
      </div>

      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${
        isOverdue ? "bg-red-50 text-red-700" : isUrgent ? "bg-amber-50 text-amber-700" : "bg-muted/50 text-muted-foreground"
      }`}>
        <Timer className={`h-4 w-4 ${isOverdue ? "animate-pulse" : ""}`} />
        <span className="text-sm font-bold">{formatTime(elapsed)}</span>
        {isOverdue && <span className="text-[10px] font-medium ml-auto">Overdue!</span>}
        {isUrgent && !isOverdue && <span className="text-[10px] font-medium ml-auto">Urgent</span>}
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium mb-1">Items</p>
        <div className="space-y-1">
          {(order.items || []).map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              {item.name} × {item.quantity}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{order.orderType === "delivery" ? "Delivery" : "Takeaway"}</span>
          <span>•</span>
          <span className="font-semibold">₹{order.total}</span>
        </div>
        <div className="flex gap-1.5">
          {order.status === "pending" && (
            <>
              <button onClick={() => onUpdate(order._id, "accepted")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95">
                <CheckCircle className="h-3 w-3" /> Accept
              </button>
              <button onClick={() => onUpdate(order._id, "cancelled")} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-700 hover:bg-red-100 transition-all active:scale-95">
                <XCircle className="h-3 w-3" /> Reject
              </button>
            </>
          )}
          {nextStatus[order.status] && (
            <button onClick={() => onUpdate(order._id, nextStatus[order.status])}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all active:scale-95 ${
                order.status === "accepted" ? "bg-purple-50 text-purple-700 hover:bg-purple-100" :
                order.status === "preparing" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" :
                "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {order.status === "accepted" ? <ChefHat className="h-3 w-3" /> : <Package className="h-3 w-3" />}
              {order.status === "accepted" ? "Start Prep" : "Mark Ready"}
            </button>
          )}
        </div>
      </div>

      {order.note && (
        <div className="mt-2 rounded-lg bg-primary/5 px-3 py-1.5 text-[10px] text-muted-foreground border border-primary/10">
          📝 {order.note}
        </div>
      )}
    </motion.div>
  );
}

export default function AdminKitchenDashboard() {
  const orders = useQuery(api.orders.list, {});
  const updateStatus = useMutation(api.orders.updateStatus);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ id: id as any, status: status as any });
      toast.success(`Order ${status === "cancelled" ? "rejected" : `moved to ${status}`}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const allOrders = (orders ?? []).filter(o =>
    ["pending", "accepted", "preparing", "ready"].includes(o.status)
  ).sort((a, b) => b.createdAt - a.createdAt);

  const filtered = allOrders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase()) && !(o.customerName || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    pending: allOrders.filter(o => o.status === "pending").length,
    accepted: allOrders.filter(o => o.status === "accepted").length,
    preparing: allOrders.filter(o => o.status === "preparing").length,
    ready: allOrders.filter(o => o.status === "ready").length,
    total: allOrders.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kitchen Dashboard</h1>
            <p className="text-sm text-muted-foreground">{stats.total} active orders</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Pending", value: stats.pending, color: "bg-amber-50 text-amber-600", icon: Clock },
          { label: "Accepted", value: stats.accepted, color: "bg-blue-50 text-blue-600", icon: CheckCircle },
          { label: "Preparing", value: stats.preparing, color: "bg-purple-50 text-purple-600", icon: ChefHat },
          { label: "Ready", value: stats.ready, color: "bg-emerald-50 text-emerald-600", icon: Package },
          { label: "Total", value: stats.total, color: "bg-gray-50 text-gray-600", icon: ListChecks },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-white border border-border/60 p-3 shadow-sm text-center">
              <Icon className={`h-4 w-4 mx-auto mb-1 ${s.color.split(" ")[1]}`} />
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {["all", "pending", "accepted", "preparing", "ready"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {s === "all" ? "All Orders" : s}
          </button>
        ))}
      </div>

      {/* Order Cards Grid */}
      {!orders ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(order => (
                <OrderCard key={order._id} order={order} onUpdate={handleUpdate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ChefHat className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No Orders Yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Kitchen orders will appear here once customers start ordering.</p>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
