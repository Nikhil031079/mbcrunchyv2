// MB Crunchy — Admin Business Settings
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Building2 } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminBusinessSettings() {
  const business = useQuery(api.settings.getBusiness);
  const update = useMutation(api.settings.updateBusiness);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const data = form ?? business ?? {};

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(data as any);
      toast.success("Business settings saved");
    } catch {
      toast.error("Failed to save business settings");
    }
    setSaving(false);
  };

  if (!business && form === null) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your business information</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Business Name</label>
              <input value={data.name ?? ""} onChange={e => setForm({ ...data, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Tagline</label>
              <input value={data.tagline ?? ""} onChange={e => setForm({ ...data, tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Email</label>
              <input type="email" value={data.email ?? ""} onChange={e => setForm({ ...data, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Phone</label>
              <input type="tel" value={data.phone ?? ""} onChange={e => setForm({ ...data, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">WhatsApp Number</label>
              <input value={data.whatsapp ?? ""} onChange={e => setForm({ ...data, whatsapp: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">GST Number</label>
              <input value={data.gst ?? ""} onChange={e => setForm({ ...data, gst: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Address</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Address</label>
              <textarea value={data.address ?? ""} onChange={e => setForm({ ...data, address: e.target.value })} rows={2}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">City</label>
              <input value={data.city ?? ""} onChange={e => setForm({ ...data, city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">State</label>
              <input value={data.state ?? ""} onChange={e => setForm({ ...data, state: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Pincode</label>
              <input value={data.pincode ?? ""} onChange={e => setForm({ ...data, pincode: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
