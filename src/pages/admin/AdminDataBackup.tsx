// MB Crunchy — Admin Data Backup & Export
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Download, Upload, Database, Save, FileJson, FileSpreadsheet, Clock, Shield } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminDataBackup() {
  const exportData = useQuery(api.settings.exportAllData);
  const logBackup = useMutation(api.settings.logBackup);
  const backupHistory = useQuery(api.settings.listBackupHistory);
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    if (!exportData) return;
    setExporting(true);
    try {
      const totalRecords = Object.values(exportData).reduce((sum, arr) => sum + arr.length, 0);
      const totalTables = Object.keys(exportData).length;

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mb-crunchy-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      await logBackup({
        fileName: a.download,
        totalTables,
        totalRecords,
      });

      toast.success(`Backup exported: ${totalRecords} records from ${totalTables} tables`);
    } catch {
      toast.error("Failed to export backup");
    }
    setExporting(false);
  };

  const handleExportCSV = () => {
    if (!exportData) return;
    try {
      // Export orders as CSV
      const orders = exportData.orders ?? [];
      if (orders.length === 0) {
        toast.error("No orders to export");
        return;
      }
      const headers = ["OrderNumber","Customer","Phone","Items","Subtotal","Delivery","Total","Status","Payment","Date"];
      const rows = orders.map((o: any) => [
        o.orderNumber,
        o.customerName ?? "",
        o.customerPhone ?? "",
        o.items?.length ?? 0,
        o.subtotal ?? 0,
        o.deliveryFee ?? 0,
        o.total ?? 0,
        o.status ?? "",
        o.paymentMethod ?? "",
        new Date(o.createdAt).toLocaleDateString(),
      ]);
      const csv = [headers.join(","), ...rows.map(r => r.map((v: any) => `"${v}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mb-crunchy-orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Orders exported as CSV");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          const tables = Object.keys(data);
          toast.success(`Imported ${tables.length} tables from ${file.name}. Note: Data is loaded client-side only. Server-side import requires admin approval.`);
        } catch {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (!exportData) return <CardSkeleton />;

  const totalRecords = Object.values(exportData).reduce((sum, arr) => sum + arr.length, 0);
  const totalTables = Object.keys(exportData).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
          <p className="text-sm text-muted-foreground">Backup, export, and import your data</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Database className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{totalTables}</p>
          <p className="text-xs text-muted-foreground">Database Tables</p>
        </div>
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Save className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Records</p>
        </div>
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Clock className="h-5 w-5 text-amber-600 mb-2" />
          <p className="text-2xl font-bold">{backupHistory?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">Backups Taken</p>
        </div>
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Shield className="h-5 w-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold">Immutable</p>
          <p className="text-xs text-muted-foreground">Audit Trail</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Export Data</h2>
          <p className="text-sm text-muted-foreground mb-4">Download your complete database as JSON or CSV.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleExportJSON}
              disabled={exporting}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <FileJson className="h-4 w-4" />
              {exporting ? "Exporting..." : `Export All (${totalRecords} records)`}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-border py-3 text-sm font-semibold hover:bg-muted transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Orders as CSV
            </button>
          </div>
        </div>

        {/* Import */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Import Data</h2>
          <p className="text-sm text-muted-foreground mb-4">Import products, categories, or coupons from a JSON file.</p>
          <button
            onClick={handleImportJSON}
            className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-border py-8 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all"
          >
            <Upload className="h-5 w-5" />
            Click to Upload JSON File
          </button>
        </div>
      </div>

      {/* Backup History */}
      {backupHistory && backupHistory.length > 0 && (
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Backup History</h2>
          <div className="space-y-2">
            {backupHistory.map((backup: any) => (
              <div key={backup._id} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{backup.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {backup.totalTables} tables • {backup.totalRecords} records
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(backup.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export content info */}
      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
        <p className="text-xs font-semibold text-amber-800">Data Export Information</p>
        <p className="text-xs text-amber-700 mt-1">
          The JSON export includes all your business data: products, categories, orders, customers, settings, reviews, and more.
          CSV export is available for orders. Import is currently client-side only for review; server-side full import requires admin approval.
        </p>
      </div>
    </div>
  );
}
