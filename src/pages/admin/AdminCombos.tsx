// MB Crunchy — Admin Combos & Party Packs (Enhanced)
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Loader2, X, Calculator } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";
import ProductSelector from "@/components/admin/ProductSelector";

export default function AdminCombos() {
  const [tab, setTab] = useState<"combos" | "party-packs">("combos");
  const combos = useQuery(api.combos.listCombos, {});
  const packs = useQuery(api.combos.listPartyPacks, {});

  const createCombo = useMutation(api.combos.createCombo);
  const updateCombo = useMutation(api.combos.updateCombo);
  const removeCombo = useMutation(api.combos.removeCombo);
  const createPack = useMutation(api.combos.createPartyPack);
  const updatePack = useMutation(api.combos.updatePartyPack);
  const removePack = useMutation(api.combos.removePartyPack);

  const [modal, setModal] = useState<{ open: boolean; type: "combo" | "pack"; edit?: any }>({ open: false, type: "combo" });
  const [f, setF] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  // Auto-calculate savings
  const itemMrp = useMemo(() => {
    if (!f.productSelections) return 0;
    return (f.productSelections as any[]).reduce((sum: number, sel: any) => sum + (sel.price || 0) * sel.quantity, 0);
  }, [f.productSelections]);

  const autoSavings = itemMrp > (f.comboPrice || 0) ? itemMrp - f.comboPrice : 0;

  const openCreate = (type: "combo" | "pack") => {
    setF({
      name: "", description: "", image: "", businessType: "kitchen",
      productSelections: [] as any[], mrp: 0, comboPrice: 0, savings: 0,
      serves: 4, occasion: "", weight: "", status: "active",
    });
    setModal({ open: true, type });
  };

  const openEdit = (type: "combo" | "pack", item: any) => {
    setF({
      name: item.name, description: item.description || "", image: item.image || "",
      businessType: item.businessType,
      productSelections: (item.productIds || []).map((id: string) => ({ productId: id, quantity: 1 })),
      mrp: item.mrp, comboPrice: type === "combo" ? item.comboPrice : item.partyPrice,
      savings: item.savings || 0,
      serves: item.serves || 4, occasion: item.occasion || "",
      weight: item.weight || "", status: item.status,
    });
    setModal({ open: true, type, edit: item });
  };

  const handleSave = async () => {
    if (!f.name) { toast.error("Name is required"); return; }
    if (!f.productSelections || f.productSelections.length === 0) {
      toast.error("Select at least one product"); return;
    }
    if (!f.comboPrice || f.comboPrice <= 0) { toast.error("Combo price is required"); return; }
    setSaving(true);
    try {
      const productIds = (f.productSelections as any[]).map((s: any) => s.productId);
      const mrp = f.mrp || itemMrp;
      const savings = f.savings || autoSavings || 0;

      const base = {
        name: f.name, description: f.description || undefined,
        businessType: f.businessType, productIds, mrp, savings,
        image: f.image || undefined, weight: f.weight || undefined,
        status: f.status,
      };

      if (modal.type === "combo") {
        const data = { ...base, comboPrice: f.comboPrice };
        if (modal.edit) { await updateCombo({ id: modal.edit._id, ...data }); toast.success("Combo updated"); }
        else { await createCombo(data as any); toast.success("Combo created"); }
      } else {
        const data = { ...base, partyPrice: f.comboPrice, serves: f.serves || 4, occasion: f.occasion || undefined };
        if (modal.edit) { await updatePack({ id: modal.edit._id, ...data }); toast.success("Party pack updated"); }
        else { await createPack(data as any); toast.success("Party pack created"); }
      }
      setModal({ open: false, type: "combo" }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id: string, type: "combo" | "pack") => {
    try { if (type === "combo") await removeCombo({ id: id as any }); else await removePack({ id: id as any }); toast.success("Deleted"); }
    catch (e: any) { toast.error(e.message); }
  };

  const items = tab === "combos" ? (combos ?? []) : (packs ?? []);

  const renderCard = (item: any, type: "combo" | "pack") => (
    <div key={item._id} className="rounded-2xl bg-white border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-all">
      {item.image && (
        <div className="h-32 bg-muted overflow-hidden">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{type === "combo" ? "🎁" : "🎉"}</span>
          <div className="flex gap-1">
            <button onClick={() => openEdit(type, item)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
            <button onClick={() => handleDelete(item._id, type)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
        <h3 className="font-semibold">{item.name}</h3>
        {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">₹{type === "combo" ? item.comboPrice : item.partyPrice}</span>
            {item.mrp > 0 && (
              <div className="text-right">
                <span className="text-xs text-muted-foreground line-through">₹{item.mrp}</span>
                <span className="ml-2 text-xs text-emerald-600 font-semibold">Save ₹{item.savings}</span>
              </div>
            )}
          </div>
          <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-semibold ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
          {type === "pack" && <p className="text-[10px] text-muted-foreground">Serves: {item.serves} {item.occasion ? `• ${item.occasion}` : ""}</p>}
          <p className="text-[10px] text-muted-foreground">{item.productIds?.length ?? 0} products included</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Combos & Party Packs</h1><p className="text-sm text-muted-foreground">{items.length} items</p></div>
        <button onClick={() => openCreate(tab === "combos" ? "combo" : "pack")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Create {tab === "combos" ? "Combo" : "Party Pack"}
        </button>
      </div>

      <div className="flex gap-2 border-b border-border/60">
        <button onClick={() => setTab("combos")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "combos" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Combos ({combos?.length ?? 0})</button>
        <button onClick={() => setTab("party-packs")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "party-packs" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Party Packs ({packs?.length ?? 0})</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => renderCard(item, tab === "combos" ? "combo" : "pack"))}
        {items.length === 0 && <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No {tab === "combos" ? "combos" : "party packs"} yet.</div>}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 bg-black/40"
          onClick={() => { if (!saving) { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-lg mx-4 my-auto"
            onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-border/60 rounded-t-2xl">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit" : "Create"} {modal.type === "combo" ? "Combo" : "Party Pack"}</h2>
              <button onClick={() => { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image */}
              <ImageUpload label={`${modal.type === "combo" ? "Combo" : "Party Pack"} Image`}
                value={f.image || ""} onChange={(v) => setF({...f, image: typeof v === "string" ? v : v[0] || ""})}
                multiple={false} maxFiles={1} />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Name *</label>
                  <input value={f.name || ""} onChange={e => setF({...f, name: e.target.value})} placeholder="Combo name"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Business Type</label>
                  <select value={f.businessType || "kitchen"} onChange={e => setF({...f, businessType: e.target.value})}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="kitchen">Kitchen</option><option value="mart">Mart</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Description</label>
                <textarea value={f.description || ""} onChange={e => setF({...f, description: e.target.value})} rows={2}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>

              {/* Product Selector */}
              <ProductSelector
                label="Products Included *"
                value={(f.productSelections || []).map((s: any) => ({ productId: s.productId, quantity: s.quantity }))}
                onChange={(selections) => setF({...f, productSelections: selections})}
                businessType={f.businessType === "both" ? undefined : f.businessType}
              />

              {/* Pricing */}
              <div className="rounded-xl border border-border/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Pricing</h3>
                  {itemMrp > 0 && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calculator className="h-3 w-3" /> Items MRP: ₹{itemMrp}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Items MRP ₹</label>
                    <input type="number" value={f.mrp || itemMrp || 0} onChange={e => setF({...f, mrp: parseFloat(e.target.value) || 0})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {modal.type === "combo" ? "Combo Price" : "Party Price"} ₹ *
                    </label>
                    <input type="number" value={f.comboPrice || 0} onChange={e => setF({...f, comboPrice: parseFloat(e.target.value) || 0})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-muted-foreground">Savings ₹ (auto: {autoSavings})</label>
                  <input type="number" value={(f.savings !== undefined && f.savings !== 0) ? f.savings : autoSavings} onChange={e => setF({...f, savings: parseFloat(e.target.value) || 0})}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  <p className="text-[10px] text-muted-foreground">Auto-calculated from items MRP. Override manually if needed.</p>
                </div>
              </div>

              {modal.type === "pack" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Serves</label>
                    <input type="number" value={f.serves || 4} onChange={e => setF({...f, serves: parseInt(e.target.value) || 1})} min={1}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Occasion</label>
                    <select value={f.occasion || ""} onChange={e => setF({...f, occasion: e.target.value})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="">Any Occasion</option>
                      <option value="birthday">🎂 Birthday</option>
                      <option value="office">💼 Office</option>
                      <option value="family">👨‍👩‍👧‍👦 Family</option>
                      <option value="festival">🎉 Festival</option>
                      <option value="school">📚 School</option>
                      <option value="college">🎓 College</option>
                      <option value="corporate">🏢 Corporate</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Weight</label>
                <input value={f.weight || ""} onChange={e => setF({...f, weight: e.target.value})} placeholder="e.g. 500g"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Status</label>
                <select value={f.status || "active"} onChange={e => setF({...f, status: e.target.value})}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-border/60 rounded-b-2xl">
              <button onClick={() => { setModal({ open: false, type: "combo" }); document.body.style.overflow = ""; }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
