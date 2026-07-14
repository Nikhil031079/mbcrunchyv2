// MB Crunchy — Admin Payment Settings
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, CreditCard, QrCode, Banknote } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminPayments() {
  const settings = useQuery(api.settings.getPaymentSettings);
  const update = useMutation(api.settings.updatePaymentSettings);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const data = form ?? settings ?? {};

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(data as any);
      toast.success("Payment settings saved");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (!settings && form === null) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Settings</h1>
          <p className="text-sm text-muted-foreground">Configure payment methods</p>
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
          <h2 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment Methods</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <input
                type="checkbox"
                checked={data.cashEnabled ?? true}
                onChange={e => setForm({ ...data, cashEnabled: e.target.checked })}
                className="rounded border-border"
              />
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Accept cash payments at delivery</p>
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <input
                type="checkbox"
                checked={data.upiEnabled ?? true}
                onChange={e => setForm({ ...data, upiEnabled: e.target.checked })}
                className="rounded border-border"
              />
              <div className="flex items-center gap-3">
                <QrCode className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">UPI Payments</p>
                  <p className="text-xs text-muted-foreground">Accept payments via UPI apps</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><QrCode className="h-4 w-4 text-primary" /> UPI Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">UPI ID</label>
              <input
                value={data.upiId ?? ""}
                onChange={e => setForm({ ...data, upiId: e.target.value })}
                placeholder="example@upi"
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <input
                type="checkbox"
                checked={data.whatsappConfirmation ?? false}
                onChange={e => setForm({ ...data, whatsappConfirmation: e.target.checked })}
                className="rounded border-border"
              />
              <div>
                <p className="text-sm font-medium">WhatsApp Confirmation</p>
                <p className="text-xs text-muted-foreground">Send payment confirmation via WhatsApp</p>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold mb-4">Payment Info</h2>
          <p className="text-sm text-muted-foreground">
            Future payment gateways (Razorpay, Stripe) can be integrated here without changing the customer experience.
            For now, payments are handled via Cash, UPI, and WhatsApp confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
