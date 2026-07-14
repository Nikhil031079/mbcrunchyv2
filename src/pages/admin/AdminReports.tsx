// MB Crunchy — Admin Reports (CSV Export)
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Download, FileText, TrendingUp, ShoppingCart, Users, Package, BarChart3 } from "lucide-react";
import { toast } from "sonner";

type ReportType = "orders" | "customers" | "products" | "inventory";

function downloadCSV(data: string[][], filename: string) {
  const csv = data.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const orders = useQuery(api.orders.list, {});
  const products = useQuery(api.products.list, {});
  const dashboard = useQuery(api.settings.getDashboardStats);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: ReportType) => {
    setExporting(type);
    await new Promise(r => setTimeout(r, 500));

    switch (type) {
      case "orders": {
        const rows = [["Order #", "Customer", "Items", "Total", "Status", "Payment", "Type", "Date"]];
        (orders ?? []).forEach(o => {
          rows.push([
            o.orderNumber, o.customerName ?? "Guest", String(o.items.length),
            String(o.total), o.status, o.paymentMethod, o.orderType ?? "takeaway",
            new Date(o.createdAt).toISOString().split("T")[0],
          ]);
        });
        downloadCSV(rows, `mb-crunchy-orders-${Date.now()}`);
        break;
      }
      case "products": {
        const rows = [["Name", "SKU", "Category", "Price", "MRP", "Stock", "Status", "Veg", "Business Type"]];
        (products ?? []).forEach(p => {
          rows.push([
            p.name, p.sku ?? "", p.categoryId ?? "", String(p.price),
            String(p.mrp ?? ""), String(p.stock ?? ""), p.status,
            p.veg ? "Veg" : "Non-Veg", p.businessType,
          ]);
        });
        downloadCSV(rows, `mb-crunchy-products-${Date.now()}`);
        break;
      }
      case "customers": {
        const rows = [["Name", "Email", "Phone", "Orders", "Total Spent", "Joined"]];
        downloadCSV(rows, `mb-crunchy-customers-${Date.now()}`);
        break;
      }
      case "inventory": {
        const rows = [["Product", "SKU", "Stock", "Low Stock Limit", "Status"]];
        (products ?? []).forEach(p => {
          rows.push([
            p.name, p.sku ?? "", String(p.stock ?? 0),
            String(p.lowStockLimit ?? 5), p.status === "active" ? "Active" : "Inactive",
          ]);
        });
        downloadCSV(rows, `mb-crunchy-inventory-${Date.now()}`);
        break;
      }
    }

    setExporting(null);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported`);
  };

  const reports = [
    { type: "orders" as const, label: "Orders Report", desc: "All orders with status, payment, and customer details", icon: ShoppingCart, count: dashboard?.totalOrders ?? 0, color: "bg-blue-50 text-blue-600" },
    { type: "customers" as const, label: "Customers Report", desc: "Customer list with order history and spending", icon: Users, count: dashboard?.totalCustomers ?? 0, color: "bg-amber-50 text-amber-600" },
    { type: "products" as const, label: "Products Report", desc: "All products with prices, stock, and categories", icon: Package, count: dashboard?.totalProducts ?? 0, color: "bg-purple-50 text-purple-600" },
    { type: "inventory" as const, label: "Inventory Report", desc: "Stock levels, low stock alerts, and status", icon: BarChart3, count: products?.filter(p => p.stock !== undefined && p.stock <= (p.lowStockLimit ?? 5)).length ?? 0, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Export business data as CSV files</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>All exports are CSV format</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <div key={r.type} className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm hover:shadow-md transition-all">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{r.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
              <p className="text-2xl font-bold mt-3">{r.count}</p>
              <button onClick={() => handleExport(r.type)} disabled={exporting === r.type}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-medium hover:bg-muted transition-all disabled:opacity-50">
                <Download className="h-4 w-4" /> {exporting === r.type ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <div className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Business Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "Total Revenue", value: `₹${(dashboard?.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp },
            { label: "Total Orders", value: String(dashboard?.totalOrders ?? 0), icon: ShoppingCart },
            { label: "Total Products", value: String(dashboard?.totalProducts ?? 0), icon: Package },
            { label: "Active Coupons", value: String(dashboard?.activeCoupons ?? 0), icon: FileText },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
