// MB Crunchy — Kitchen Dashboard (Order Fulfillment View)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, ChefHat, Package, AlertCircle, Search, UtensilsCrossed, Timer, ListChecks } from "lucide-react";

interface KitchenOrder {
  id: string;
  number: string;
  customer: string;
  items: string[];
  total: number;
  type: string;
  status: string;
  elapsed: number;
  priority: boolean;
  note?: string;
}

const demoOrders: KitchenOrder[] = [
  { id: "1", number: "MB-KITCHEN-001", customer: "Rahul S.", items: ["Margherita Pizza", "Peri Peri Fries x2", "Garlic Bread"], total: 496, type: "Delivery", status: "pending", elapsed: 2, priority: true, note: "Extra cheese please" },
  { id: "2", number: "MB-KITCHEN-002", customer: "Priya M.", items: ["Chicken Momos (12 pcs)", "Classic French Fries", "Cold Drink"], total: 378, type: "Takeaway", status: "accepted", elapsed: 5, priority: false },
  { id: "3", number: "MB-KITCHEN-003", customer: "Amit K.", items: ["Family Pizza Combo"], total: 699, type: "Delivery", status: "preparing", elapsed: 12, priority: true, note: "Ring bell before calling" },
  { id: "4", number: "MB-KITCHEN-004", customer: "Sneha P.", items: ["Burger Feast Combo", "Cheese Loaded Fries"], total: 548, type: "Delivery", status: "preparing", elapsed: 20, priority: false },
  { id: "5", number: "MB-KITCHEN-005", customer: "Vikram S.", items: ["Chicken Tikka Burger", "Peri Peri Fries"], total: 328, type: "Takeaway", status: "ready", elapsed: 28, priority: false },
  { id: "6", number: "MB-KITCHEN-006", customer: "Neha G.", items: ["Veg Spring Rolls (6 pcs)", "Hakka Noodles"], total: 278, type: "Delivery", status: "pending", elapsed: 1, priority: false },
];

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

function OrderCard({ order, onUpdate }: { order: KitchenOrder; onUpdate: (id: string, status: string) => void }) {
  const [elapsed, setElapsed] = useState(order.elapsed);

  useEffect(() => {
    if (order.status === "ready") return;
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
        order.priority ? "border-red-200 bg-red-50/30" :
        isOverdue ? "border-red-200 bg-red-50/10" :
        isUrgent ? "border-amber-200 bg-amber-50/10" :
        "border-border/60 bg-white"
      } ${order.status === "ready" ? "ring-2 ring-emerald-200" : ""}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 ${
            order.priority ? "border-red-300 bg-red-100 text-red-600" : "border-border bg-muted text-muted-foreground"
          }`}>
            {order.priority ? <AlertCircle className="h-4 w-4" /> : <ListChecks className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-sm font-mono font-bold">{order.number.split("-").pop()}</p>
            <p className="text-[10px] text-muted-foreground">{order.customer}</p>
          </div>
        </div>
        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize border ${statusStyles[order.status] ?? ""}`}>
          {order.status}
        </span>
      </div>

      {/* Timer */}
      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${
        isOverdue ? "bg-red-50 text-red-700" : isUrgent ? "bg-amber-50 text-amber-700" : "bg-muted/50 text-muted-foreground"
      }`}>
        <Timer className={`h-4 w-4 ${isOverdue ? "animate-pulse" : ""}`} />
        <span className="text-sm font-bold">{formatTime(elapsed)}</span>
        {isOverdue && <span className="text-[10px] font-medium ml-auto">Overdue!</span>}
        {isUrgent && !isOverdue && <span className="text-[10px] font-medium ml-auto">Urgent</span>}
      </div>

      {/* Items */}
      <div className="mb-3">
        <p className="text-xs font-medium mb-1">Items</p>
        <div className="space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{order.type}</span>
          <span>•</span>
          <span className="font-semibold">₹{order.total}</span>
        </div>
        <div className="flex gap-1.5">
          {order.status === "pending" && (
            <>
              <button onClick={() => onUpdate(order.id, "accepted")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95">
                <CheckCircle className="h-3 w-3" /> Accept
              </button>
              <button onClick={() => onUpdate(order.id, "cancelled")} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-700 hover:bg-red-100 transition-all active:scale-95">
                <XCircle className="h-3 w-3" /> Reject
              </button>
            </>
          )}
          {nextStatus[order.status] && (
            <button onClick={() => onUpdate(order.id, nextStatus[order.status])}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all active:scale-95 ${
                order.status === "accepted" ? "bg-purple-50 text-purple-700 hover:bg-purple-100" :
                order.status === "preparing" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" :
                "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {order.status === "accepted" ? <ChefHat className="h-3 w-3" /> :
               order.status === "preparing" ? <Package className="h-3 w-3" /> : null}
              {order.status === "accepted" ? "Start Prep" : order.status === "preparing" ? "Mark Ready" : ""}
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
  const [orders, setOrders] = useState<KitchenOrder[]>(demoOrders);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleUpdate = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.number.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    pending: orders.filter(o => o.status === "pending").length,
    accepted: orders.filter(o => o.status === "accepted").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
    total: orders.length,
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
            <p className="text-sm text-muted-foreground">{stats.total} orders today</p>
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

      {/* Search & Filter */}
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
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onUpdate={handleUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No orders found</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
