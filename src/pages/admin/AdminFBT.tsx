// MB Crunchy — Admin Frequently Bought Together Management
// Admin-controlled cross-sell rules with priority: manual combos > FBT table > category fallback
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, X, Link2, Package, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const RULE_TYPES = [
  { value: "manual", label: "Manual Recommendation" },
  { value: "frequently-bought", label: "Frequently Bought Together" },
  { value: "category", label: "Same Category (fallback)" },
  { value: "tag", label: "Same Tags" },
];

export default function AdminFBT() {
  const products = useQuery(api.products.list, {});
  const rules = useQuery(api.cart_extras.listCrossSellRules, {});
  const createRule = useMutation(api.cart_extras.createCrossSellRule);
  const removeRule = useMutation(api.cart_extras.removeCrossSellRule);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    suggestedProductIds: [] as string[],
    ruleType: "frequently-bought" as string,
    isActive: true,
  });

  const productList = ((products ?? []) as any[]).filter((p: any) => p.status === "active");
  const ruleList = ((rules ?? []) as any[]).sort((a: any, b: any) => b.createdAt - a.createdAt);

  const getProductName = (id: string) => productList.find((p: any) => p._id === id)?.name || id;

  const handleAddSuggested = (id: string) => {
    if (!form.suggestedProductIds.includes(id)) {
      setForm({ ...form, suggestedProductIds: [...form.suggestedProductIds, id] });
    }
  };

  const handleRemoveSuggested = (id: string) => {
    setForm({ ...form, suggestedProductIds: form.suggestedProductIds.filter(i => i !== id) });
  };

  const handleSave = async () => {
    if (!form.productId || form.suggestedProductIds.length === 0) {
      toast.error("Select a product and at least one suggestion");
      return;
    }
    await createRule({
      productId: form.productId as any,
      suggestedProductIds: form.suggestedProductIds as any,
      ruleType: form.ruleType as any,
      isActive: form.isActive,
    });
    resetForm();
    toast.success("FBT rule created!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recommendation rule?")) return;
    await removeRule({ id: id as any });
    toast.success("Rule deleted");
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ productId: "", suggestedProductIds: [], ruleType: "frequently-bought", isActive: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recommendations Engine</h1>
          <p className="text-sm text-muted-foreground">
            Configure Frequently Bought Together rules &mdash; priority: manual &gt; FBT table &gt; same category &gt; same tags
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> New Rule
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">New FBT Rule</h3>
            <button onClick={resetForm} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>

          {/* Trigger Product */}
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">When customer buys</label>
            <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Select a product...</option>
              {productList.map((p: any) => (
                <option key={p._id} value={p._id}>{p.name} ({p.businessType})</option>
              ))}
            </select>
          </div>

          {/* Suggested Products */}
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Recommend these products</label>
            <div className="mt-1 flex flex-wrap gap-1.5 mb-2">
              {form.suggestedProductIds.map(id => (
                <span key={id} className="inline-flex items-center gap-1 rounded-lg bg-primary/5 border border-primary/20 px-2.5 py-1 text-xs">
                  <Package className="h-3 w-3 text-primary" />
                  {getProductName(id)}
                  <button onClick={() => handleRemoveSuggested(id)} className="ml-0.5 hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <select onChange={e => { if (e.target.value) { handleAddSuggested(e.target.value); e.target.value = ""; }}}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Add suggested product...</option>
              {productList.filter(p => p._id !== form.productId && !form.suggestedProductIds.includes(p._id)).map((p: any) => (
                <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>
              ))}
            </select>
          </div>

          {/* Rule Type */}
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Rule Type</label>
            <select value={form.ruleType} onChange={e => setForm({ ...form, ruleType: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm">
              {RULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
              className="rounded border-border" />
            <span className="text-xs font-medium">Active</span>
          </label>

          <button onClick={handleSave} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            Create Rule
          </button>
        </motion.div>
      )}

      {/* Rules List */}
      {ruleList.length === 0 && !showForm && (
        <div className="text-center py-16">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No recommendation rules yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Create rules to suggest products customers frequently buy together.</p>
        </div>
      )}

      <div className="space-y-3">
        {ruleList.map((rule: any, idx: number) => (
          <motion.div key={rule._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/60 bg-white p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold text-sm">{getProductName(rule.productId)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                    rule.ruleType === "manual" ? "bg-purple-50 text-purple-700" :
                    rule.ruleType === "frequently-bought" ? "bg-blue-50 text-blue-700" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {RULE_TYPES.find(r => r.value === rule.ruleType)?.label || rule.ruleType}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                    rule.isActive ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                  }`}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(rule.suggestedProductIds || []).map((id: string) => (
                    <span key={id} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      <Package className="h-2.5 w-2.5" /> {getProductName(id)}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(rule._id)}
                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
