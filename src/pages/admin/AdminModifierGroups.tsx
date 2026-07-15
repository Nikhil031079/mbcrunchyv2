// MB Crunchy — Admin Modifier Groups Management
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, X, Package, Layers, ListChecks } from "lucide-react";
import { toast } from "sonner";

const SELECTION_TYPES = [
  { value: "single", label: "Single Select" },
  { value: "multiple", label: "Multiple Select" },
  { value: "quantity", label: "Quantity" },
];

function OptionForm({ groupId, initial, onSave, onCancel }: { groupId: string; initial?: any; onSave: (data: any) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    price: initial?.price || 0,
    sortOrder: initial?.sortOrder || 0,
    inStock: initial?.inStock ?? true,
    isDefault: initial?.isDefault ?? false,
    maxQuantity: initial?.maxQuantity || 1,
  });

  return (
    <form onSubmit={async (e) => { e.preventDefault(); if (!form.name.trim()) { toast.error("Name required"); return; } await onSave(form); }}
      className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
        className="flex-1 rounded-lg border border-border px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Option name" />
      <input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
        className="w-16 rounded-lg border border-border px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="₹" />
      <label className="flex items-center gap-1 text-[10px] cursor-pointer">
        <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="rounded" /> Default
      </label>
      <button type="submit" className="rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90">Save</button>
      {onCancel && <button type="button" onClick={onCancel} className="p-1 hover:bg-muted rounded"><X className="h-3 w-3" /></button>}
    </form>
  );
}

function GroupCard({ group, onEdit, onDelete }: { group: any; onEdit: (g: any) => void; onDelete: (id: string) => void }) {
  const options = useQuery(api.products_extras.listModifierOptions, { groupId: group._id });
  const createOption = useMutation(api.products_extras.createModifierOption);
  const updateOption = useMutation(api.products_extras.updateModifierOption);
  const removeOption = useMutation(api.products_extras.removeModifierOption);
  const [showNewOption, setShowNewOption] = useState(false);
  const optionList = (options ?? []) as any[];

  return (
    <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{group.name}</h3>
            <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${group.required ? "bg-red-50 text-red-700" : "bg-muted text-muted-foreground"}`}>
              {group.required ? "Required" : "Optional"}
            </span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] capitalize">{group.selectionType}</span>
          </div>
          {group.description && <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>}
          <p className="text-[10px] text-muted-foreground mt-0.5">Min: {group.min ?? 0} | Max: {group.max ?? "No max"}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(group)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"><Edit3 className="h-3.5 w-3.5" /></button>
          <button onClick={() => onDelete(group._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="space-y-1 ml-5">
        {optionList.map((opt: any) => (
          <div key={opt._id} className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted/30 text-xs">
            <div className="flex items-center gap-2">
              <ListChecks className="h-3 w-3 text-muted-foreground" />
              <span>{opt.name}</span>
              {opt.isDefault && <span className="text-[9px] font-medium text-primary bg-primary/5 px-1.5 py-0.5 rounded">Default</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">₹{opt.price}</span>
              <span className={`h-2 w-2 rounded-full ${opt.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
              <button onClick={() => removeOption({ id: opt._id })} className="p-0.5 text-muted-foreground hover:text-red-500"><X className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
        {showNewOption && (
          <OptionForm groupId={group._id} onSave={async (data) => { await createOption({ ...data, groupId: group._id }); setShowNewOption(false); toast.success("Option added"); }} onCancel={() => setShowNewOption(false)} />
        )}
        <button onClick={() => setShowNewOption(true)} className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-1">
          <Plus className="h-3 w-3" /> Add Option
        </button>
      </div>
    </div>
  );
}

export default function AdminModifierGroups() {
  const products = useQuery(api.products.list, {});
  const createGroup = useMutation(api.products_extras.createModifierGroup);
  const updateGroup = useMutation(api.products_extras.updateModifierGroup);
  const removeGroup = useMutation(api.products_extras.removeModifierGroup);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", selectionType: "", min: 0, max: 0, required: false, sortOrder: 0 });

  const productList = (products ?? []).filter((p: any) => p.status === "active" || p.status === "draft");
  const groups = useQuery(api.products_extras.listModifierGroups, selectedProductId ? { productId: selectedProductId as any } : "skip");

  useEffect(() => {
    if (!selectedProductId && productList.length > 0) setSelectedProductId(productList[0]._id);
  }, [productList, selectedProductId]);

  const groupList = (groups ?? []) as any[];

  const handleSaveGroup = async () => {
    if (!selectedProductId || !form.name.trim()) { toast.error("Select a product and enter a name"); return; }
    const data: any = { ...form, productId: selectedProductId as any };
    if (editing) {
      await updateGroup({ id: editing._id, ...data });
    } else {
      await createGroup(data);
    }
    setShowForm(false); setEditing(null);
    setForm({ name: "", description: "", selectionType: "", min: 0, max: 0, required: false, sortOrder: 0 });
    toast.success(editing ? "Group updated!" : "Group created!");
  };

  const handleEdit = (g: any) => {
    setEditing(g);
    setForm({ name: g.name, description: g.description || "", selectionType: g.selectionType || "single", min: g.min ?? 0, max: g.max ?? 0, required: g.required, sortOrder: g.sortOrder ?? 0 });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this modifier group and all its options?")) return;
    await removeGroup({ id: id as any });
    toast.success("Group deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Modifier Groups</h1>
          <p className="text-sm text-muted-foreground">Manage product modifiers (sizes, toppings, crusts, etc.)</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedProductId} onChange={e => { setSelectedProductId(e.target.value); setShowForm(false); setEditing(null); }}
            className="rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Select a product...</option>
            {productList.map((p: any) => <option key={p._id} value={p._id}>{p.name} ({p.businessType})</option>)}
          </select>
          <button onClick={() => { setEditing(null); setForm({ name: "", description: "", selectionType: "single", min: 0, max: 0, required: false, sortOrder: 0 }); setShowForm(!showForm); }}
            disabled={!selectedProductId}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
            <Plus className="h-4 w-4" /> New Group
          </button>
        </div>
      </div>

      {selectedProductId && (
        <div className="rounded-xl bg-muted/30 border border-border/60 p-3 flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">{productList.find((p: any) => p._id === selectedProductId)?.name}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl bg-white border border-border/60 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">{editing ? "Edit Modifier Group" : "New Modifier Group"}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Group Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Choose Size" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Select your preferred size" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Selection Type</label>
              <select value={form.selectionType} onChange={e => setForm({ ...form, selectionType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm">
                {SELECTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Min / Max</label>
              <div className="flex gap-2 mt-1">
                <input type="number" value={form.min} onChange={e => setForm({ ...form, min: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm" placeholder="Min" />
                <input type="number" value={form.max} onChange={e => setForm({ ...form, max: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm" placeholder="Max" />
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.required} onChange={e => setForm({ ...form, required: e.target.checked })} className="rounded border-border" />
            <span className="text-xs font-medium">Required (customer must select)</span>
          </label>
          <button onClick={handleSaveGroup} className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            {editing ? "Update Group" : "Create Group"}
          </button>
        </div>
      )}

      {!selectedProductId && (
        <div className="text-center py-16">
          <Layers className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Select a product above to manage its modifier groups.</p>
        </div>
      )}

      {selectedProductId && groupList.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No modifier groups for this product yet.</p>
        </div>
      )}

      {groupList.length > 0 && (
        <div className="space-y-3">
          {groupList.map((g: any) => (
            <GroupCard key={g._id} group={g} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
