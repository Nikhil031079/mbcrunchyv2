// MB Crunchy — Admin System Settings
import { useState } from "react";
import { Save, Settings2, Globe, Info, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminSystemSettings() {
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success("System settings saved");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground">Global application configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Regional Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Timezone</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" /> Application Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={e => setMaintenance(e.target.checked)}
                className="rounded border-border"
              />
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Show maintenance page to customers</p>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> System Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/40">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/40">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium">React + Vite</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/40">
              <span className="text-muted-foreground">Backend</span>
              <span className="font-medium">Convex</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium">Convex (25+ tables)</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Data Management</h2>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Advanced data operations for system administrators.
            </p>
            <button className="w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:border-amber-400 hover:text-amber-600 transition-colors disabled:opacity-50">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Clear Application Cache
            </button>
            <button className="w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 transition-colors">
              <Database className="h-4 w-4 inline mr-2" />
              Export Database Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
