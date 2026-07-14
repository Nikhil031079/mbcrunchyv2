// MB Crunchy — Admin Dashboard
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { ShoppingCart, Users, Package, Star, DollarSign, AlertTriangle, TicketPercent, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = useQuery(api.settings.getDashboardStats);

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
    { label: "Total Revenue", value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: "Products", value: stats?.totalProducts ?? 0, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Customers", value: stats?.totalCustomers ?? 0, icon: Users, color: "bg-amber-50 text-amber-600" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0, icon: ShoppingCart, color: "bg-orange-50 text-orange-600" },
    { label: "Pending Reviews", value: stats?.pendingReviews ?? 0, icon: Star, color: "bg-rose-50 text-rose-600" },
    { label: "Active Coupons", value: stats?.activeCoupons ?? 0, icon: TicketPercent, color: "bg-cyan-50 text-cyan-600" },
    { label: "Low Stock Items", value: stats?.lowStockCount ?? 0, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your business</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <span className="text-xs text-muted-foreground">Latest 5</span>
        </div>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="space-y-2">
            {stats.recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">₹{order.total} • {order.customerName ?? "Guest"}</p>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${order.status === "completed" ? "bg-emerald-50 text-emerald-700" : order.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No orders yet. Start taking orders!
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product", href: "/admin/products", emoji: "📦" },
            { label: "View Orders", href: "/admin/orders", emoji: "📋" },
            { label: "Manage Categories", href: "/admin/categories", emoji: "🏷️" },
            { label: "Create Coupon", href: "/admin/coupons", emoji: "🎫" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 hover:bg-muted hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
