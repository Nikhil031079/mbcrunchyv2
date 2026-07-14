// MB Crunchy — Admin Delivery Settings
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Truck } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminDelivery() {
  const charges = useQuery(api.settings.listDeliveryCharges);
  const update = useMutation(api.settings.updateDeliveryCharges);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const currentCharges = charges?.[0];
  const data = form ?? currentCharges ?? { charge: 0, minOrderFree: 0, estimatedMinutes: 30 };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ id: currentCharges?._id, ...data });
      toast.success("Delivery settings saved");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (!charges && form === null) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Settings</h1>
          <p className="text-sm text-muted-foreground">Configure delivery charges and zones</p>
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
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Delivery Charges</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Delivery Charge (₹)</label>
              <input
                type="number"
                min={0}
                value={data.charge ?? 0}
                onChange={e => setForm({ ...data, charge: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Free Delivery Above (₹)</label>
              <input
                type="number"
                min={0}
                value={data.minOrderFree ?? 0}
                onChange={e => setForm({ ...data, minOrderFree: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Orders above this amount get free delivery</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Estimated Delivery Time (min)</label>
              <input
                type="number"
                min={1}
                value={data.estimatedMinutes ?? 30}
                onChange={e => setForm({ ...data, estimatedMinutes: parseInt(e.target.value) || 30 })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Delivery Info</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Delivery charges apply to orders below the free delivery threshold.</p>
            <p>• Estimated time is shown to customers during checkout.</p>
            <p>• Zone-based delivery radius can be expanded in future updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
