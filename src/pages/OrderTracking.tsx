// MB Crunchy — Order Tracking Page with Status Timeline
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Truck, CheckCircle, Clock, ChefHat, Package, MapPin, XCircle } from "lucide-react";

const statusFlow = [
  { status: "pending", label: "Order Placed", icon: Clock, description: "Your order has been received and is awaiting confirmation." },
  { status: "accepted", label: "Accepted", icon: CheckCircle, description: "Your order has been confirmed by the restaurant." },
  { status: "preparing", label: "Preparing", icon: ChefHat, description: "Your food is being prepared fresh in our kitchen." },
  { status: "ready", label: "Ready", icon: Package, description: "Your order is packed and ready." },
  { status: "out-for-delivery", label: "Out for Delivery", icon: Truck, description: "Your order is on its way!" },
  { status: "completed", label: "Delivered", icon: MapPin, description: "Order delivered successfully. Enjoy! 🎉" },
];

const cancelledStatus = { status: "cancelled", label: "Cancelled", icon: XCircle, description: "This order has been cancelled." };

interface DemoOrder {
  number: string;
  status: string;
  customerName: string;
  items: string[];
  total: number;
  type: string;
  createdAt: number;
}

const demoOrders: DemoOrder[] = [
  { number: "MB-DEMO-001", status: "pending", customerName: "Rahul S.", items: ["Margherita Pizza", "Peri Peri Fries"], total: 338, type: "Delivery", createdAt: Date.now() - 1000 * 60 * 15 },
  { number: "MB-DEMO-002", status: "preparing", customerName: "Priya M.", items: ["Chicken Momos (12 pcs)", "Classic French Fries"], total: 288, type: "Takeaway", createdAt: Date.now() - 1000 * 60 * 30 },
  { number: "MB-DEMO-003", status: "out-for-delivery", customerName: "Amit K.", items: ["Family Pizza Combo"], total: 699, type: "Delivery", createdAt: Date.now() - 1000 * 60 * 45 },
  { number: "MB-DEMO-004", status: "completed", customerName: "Sneha P.", items: ["Burger Feast Combo", "Cheese Loaded Fries"], total: 548, type: "Delivery", createdAt: Date.now() - 1000 * 60 * 120 },
];

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const isCancelled = currentStatus === "cancelled";
  const steps = isCancelled ? [cancelledStatus] : statusFlow;
  const currentIdx = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i <= currentIdx && !isCancelled;
        const isCurrent = i === currentIdx && !isCancelled;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                isCancelled && i === 0 ? "bg-red-50 text-red-600" :
                isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-muted text-muted-foreground"
              } ${isCurrent ? "scale-110 ring-2 ring-primary/20" : ""}`}>
                <Icon className="h-4 w-4" />
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 h-10 transition-colors duration-300 ${isActive && i < currentIdx ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
            <div className={`pb-8 ${!isActive && !isCancelled ? "opacity-40" : ""}`}>
              <p className={`text-sm font-semibold ${isCurrent ? "text-primary" : ""}`}>{step.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderTracking() {
  const [searchNum, setSearchNum] = useState("");
  const [foundOrder, setFoundOrder] = useState<DemoOrder | null>(null);

  const handleSearch = () => {
    const order = demoOrders.find(o => o.number.toLowerCase() === searchNum.trim().toLowerCase());
    setFoundOrder(order ?? null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Track Your Order</h1>
          <p className="text-sm text-muted-foreground mb-4">Enter your order number to see live status</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={searchNum} onChange={e => setSearchNum(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Enter order number (e.g. MB-DEMO-001)"
                className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <button onClick={handleSearch}
              className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
              Track
            </button>
          </div>
        </div>

        {foundOrder ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Order Header */}
            <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Order Number</p>
                  <p className="text-lg font-mono font-bold">{foundOrder.number}</p>
                </div>
                <span className={`self-start rounded-lg px-3 py-1 text-[11px] font-semibold capitalize ${
                  foundOrder.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                  foundOrder.status === "cancelled" ? "bg-red-50 text-red-700" :
                  foundOrder.status === "out-for-delivery" ? "bg-blue-50 text-blue-700" :
                  "bg-amber-50 text-amber-700"
                }`}>{foundOrder.status}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{foundOrder.customerName}</p></div>
                <div><p className="text-xs text-muted-foreground">Type</p><p className="font-medium">{foundOrder.type}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold">₹{foundOrder.total}</p></div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Items</p>
                <p className="text-sm">{foundOrder.items.join(", ")}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
              <h2 className="font-bold mb-6">Order Status</h2>
              <StatusTimeline currentStatus={foundOrder.status} />
            </div>
          </motion.div>
        ) : searchNum && foundOrder === null ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No order found with that number.</p>
            <p className="text-xs text-muted-foreground mt-1">Try: MB-DEMO-001, MB-DEMO-002, MB-DEMO-003, or MB-DEMO-004</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Enter your order number above to track your order status.</p>
            <p className="text-xs text-muted-foreground mt-1">Demo orders: MB-DEMO-001 through MB-DEMO-004</p>
          </div>
        )}
      </div>
    </div>
  );
}
