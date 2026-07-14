// MB Crunchy — Admin System Settings (Connected to Convex)
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Settings2, Globe, Info, Database } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminSystemSettings() {
  const system = useQuery(api.settings.getSystemSettings);
  const update = useMutation(api.settings.updateSystemSettings);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const data = form ?? system ?? {};

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(data as any);
      toast.success("System settings saved");
    } catch {
      toast.error("Failed to save system settings");
    }
    setSaving(false);
  };

  if (!system && form === null) return <CardSkeleton />;

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
                value={data.currency ?? "INR"}
                onChange={e => setForm({ ...data, currency: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Currency Symbol</label>
              <input value={data.currencySymbol ?? "₹"} onChange={e => setForm({ ...data, currencySymbol: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Timezone</label>
              <select
                value={data.timezone ?? "Asia/Kolkata"}
                onChange={e => setForm({ ...data, timezone: e.target.value })}
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
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Order Prefix</label>
              <input value={data.orderPrefix ?? "MB"} onChange={e => setForm({ ...data, orderPrefix: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">GST (%)</label>
              <input type="number" min={0} max={100} value={data.gstPercent ?? 0} onChange={e => setForm({ ...data, gstPercent: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Packaging Charge (₹)</label>
              <input type="number" min={0} value={data.packagingCharge ?? 0} onChange={e => setForm({ ...data, packagingCharge: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Free Delivery Threshold (₹)</label>
              <input type="number" min={0} value={data.freeDeliveryThreshold ?? 199} onChange={e => setForm({ ...data, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Delivery Radius (km)</label>
              <input type="number" min={0} value={data.deliveryRadius ?? 10} onChange={e => setForm({ ...data, deliveryRadius: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Min Order Value (₹)</label>
              <input type="number" min={0} value={data.minOrderValue ?? 0} onChange={e => setForm({ ...data, minOrderValue: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <input type="checkbox" checked={data.maintenanceMode ?? false} onChange={e => setForm({ ...data, maintenanceMode: e.target.checked })} className="rounded border-border" />
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Show maintenance page to customers</p>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" /> Timing Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Estimated Prep Time (min)</label>
              <input type="number" min={1} value={data.estimatedPrepMinutes ?? 20} onChange={e => setForm({ ...data, estimatedPrepMinutes: parseInt(e.target.value) || 20 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Estimated Delivery Time (min)</label>
              <input type="number" min={1} value={data.estimatedDeliveryMinutes ?? 30} onChange={e => setForm({ ...data, estimatedDeliveryMinutes: parseInt(e.target.value) || 30 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Social Media Links</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Instagram URL</label>
              <input value={data.socialMediaInstagram ?? ""} onChange={e => setForm({ ...data, socialMediaInstagram: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="https://instagram.com/mbcrunchy" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Facebook URL</label>
              <input value={data.socialMediaFacebook ?? ""} onChange={e => setForm({ ...data, socialMediaFacebook: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="https://facebook.com/mbcrunchy" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">YouTube URL</label>
              <input value={data.socialMediaYoutube ?? ""} onChange={e => setForm({ ...data, socialMediaYoutube: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="https://youtube.com/@mbcrunchy" />
            </div>
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
              <span className="font-medium">Convex</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
