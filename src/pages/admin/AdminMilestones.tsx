// MB Crunchy — Delivery Milestones Admin
// Admin-configurable reward thresholds: ₹199 free delivery, ₹299 free dessert, ₹499 10% off

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import {
  Plus, Edit3, Trash2, X, Gift, Truck, Percent, DollarSign,
  TrendingUp, Package,
} from "lucide-react";
import { toast } from "sonner";

const REWARD_TYPES = [
  { value: "free-delivery", label: "Free Delivery", icon: Truck },
  { value: "free-item", label: "Free Item", icon: Gift },
  { value: "discount", label: "Discount (%)", icon: Percent },
  { value: "cashback", label: "Cashback (₹)", icon: DollarSign },
];

const ICON_OPTIONS = [
  { value: "truck", label: "Truck", icon: "🚚" },
  { value: "gift", label: "Gift", icon: "🎁" },
  { value: "star", label: "Star", icon: "⭐" },
  { value: "discount", label: "Discount", icon: "🏷️" },
  { value: "sparkles", label: "Sparkles", icon: "✨" },
  { value: "crown", label: "Crown", icon: "👑" },
];

export default function AdminMilestones() {
  const milestones = useQuery(api.delivery_extras.listMilestones, {});
  const upsertMilestone = useMutation(api.delivery_extras.upsertMilestone);
  const removeMilestone = useMutation(api.delivery_extras.removeMilestone);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    threshold: 0,
    label: "",
    description: "",
    rewardType: "free-delivery" as string,
    rewardValue: undefined as number | undefined,
    rewardItemName: "",
    icon: "gift",
    isActive: true,
  });

  const milestoneList = (milestones ?? []) as any[];

  const handleSave = async () => {
    if (!form.threshold || !form.label.trim()) {
      toast.error("Threshold and label are required");
      return;
    }
    await upsertMilestone({
      id: editing?._id,
      threshold: form.threshold,
      label: form.label,
      description: form.description || undefined,
      rewardType: form.rewardType as any,
      rewardValue: form.rewardValue,
      rewardItemName: form.rewardItemName || undefined,
      icon: form.icon,
      isActive: form.isActive,
    });
    resetForm();
    toast.success(editing ? "Milestone updated!" : "Milestone created!");
  };

  const handleEdit = (m: any) => {
    setEditing(m);
    setForm({
      threshold: m.threshold,
      label: m.label,
      description: m.description || "",
      rewardType: m.rewardType || "free-delivery",
      rewardValue: m.rewardValue,
      rewardItemName: m.rewardItemName || "",
      icon: m.icon || "gift",
      isActive: m.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    await removeMilestone({ id: id as any });
    toast.success("Milestone deleted");
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({
      threshold: 0,
      label: "",
      description: "",
      rewardType: "free-delivery",
      rewardValue: undefined,
      rewardItemName: "",
      icon: "gift",
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Delivery Milestones</h1>
          <p className="text-sm text-muted-foreground">Configure order value thresholds and rewards</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> New Milestone
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editing ? "Edit Milestone" : "New Milestone"}</h3>
            <button onClick={resetForm} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Threshold (₹) *</label>
              <input type="number" value={form.threshold || ""} onChange={e => setForm({ ...form, threshold: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="199" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Label *</label>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Free Delivery" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Add ₹X more for free delivery" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Reward Type</label>
              <select value={form.rewardType} onChange={e => setForm({ ...form, rewardType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm">
                {REWARD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                {form.rewardType === "free-item" ? "Item Name" :
                 form.rewardType === "discount" ? "Discount %" :
                 form.rewardType === "cashback" ? "Cashback ₹" : "Reward Value"}
              </label>
              {form.rewardType === "free-item" ? (
                <input value={form.rewardItemName} onChange={e => setForm({ ...form, rewardItemName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Free Dessert" />
              ) : (
                <input type="number" value={form.rewardValue ?? ""} onChange={e => setForm({ ...form, rewardValue: parseFloat(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="10" />
              )}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Icon</label>
              <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm">
                {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.icon} {o.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="rounded border-border" />
              <span className="text-xs font-medium">Active</span>
            </div>
          </div>
          <button onClick={handleSave} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            {editing ? "Update Milestone" : "Create Milestone"}
          </button>
        </motion.div>
      )}

      {/* Milestones List */}
      {milestoneList.length === 0 && !showForm && (
        <div className="text-center py-16">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No milestones configured yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Create reward thresholds to encourage higher order values.</p>
        </div>
      )}

      <div className="space-y-3">
        {milestoneList.map((m: any, idx: number) => (
          <motion.div key={m._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/60 bg-white p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  m.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{m.label}</h3>
                    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                      m.isActive ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-primary">₹{m.threshold}+</span>
                    <span className="text-xs text-muted-foreground capitalize">• {m.rewardType?.replace(/-/g, " ")}</span>
                    {m.rewardItemName && <span className="text-xs text-muted-foreground">• {m.rewardItemName}</span>}
                    {m.rewardValue && <span className="text-xs text-muted-foreground">• {m.rewardValue}{m.rewardType === "discount" ? "%" : m.rewardType === "cashback" ? "₹" : ""}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(m)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(m._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
