// MB Crunchy — Admin Branding Settings
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Palette } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminBranding() {
  const branding = useQuery(api.settings.getBranding);
  const update = useMutation(api.settings.updateBranding);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const data = form ?? branding ?? {};

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(data as any);
      toast.success("Branding settings saved");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (!branding && form === null) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branding</h1>
          <p className="text-sm text-muted-foreground">Customize your brand appearance</p>
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
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Theme Colors</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Primary Color</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={data.primaryColor ?? "#C62828"}
                  onChange={e => setForm({ ...data, primaryColor: e.target.value })}
                  className="h-10 w-10 rounded-xl border border-border cursor-pointer"
                />
                <input
                  value={data.primaryColor ?? "#C62828"}
                  onChange={e => setForm({ ...data, primaryColor: e.target.value })}
                  className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Secondary Color</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={data.secondaryColor ?? "#111111"}
                  onChange={e => setForm({ ...data, secondaryColor: e.target.value })}
                  className="h-10 w-10 rounded-xl border border-border cursor-pointer"
                />
                <input
                  value={data.secondaryColor ?? "#111111"}
                  onChange={e => setForm({ ...data, secondaryColor: e.target.value })}
                  className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Accent Color</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={data.accentColor ?? "#F9A825"}
                  onChange={e => setForm({ ...data, accentColor: e.target.value })}
                  className="h-10 w-10 rounded-xl border border-border cursor-pointer"
                />
                <input
                  value={data.accentColor ?? "#F9A825"}
                  onChange={e => setForm({ ...data, accentColor: e.target.value })}
                  className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Store Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Store Name</label>
              <input
                value={data.storeName ?? ""}
                onChange={e => setForm({ ...data, storeName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Tagline</label>
              <input
                value={data.tagline ?? ""}
                onChange={e => setForm({ ...data, tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">About Text</label>
              <textarea
                value={data.aboutText ?? ""}
                onChange={e => setForm({ ...data, aboutText: e.target.value })}
                rows={4}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold mb-4">Preview</h2>
          <div
            className="rounded-xl p-6 text-center"
            style={{ backgroundColor: data.primaryColor ?? "#C62828" }}
          >
            <p className="text-lg font-bold text-white">{data.storeName || "MB Crunchy"}</p>
            <p className="text-sm text-white/80 mt-1">{data.tagline || "Fresh • Homemade • Premium"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
