// MB Crunchy — Admin Products Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const products = useQuery(api.products.list, {});
  const categories = useQuery(api.categories.list, {});
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const updateStatus = useMutation(api.products.updateStatus);
  const removeProduct = useMutation(api.products.remove);
  const duplicateProduct = useMutation(api.products.duplicate);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formBizType, setFormBizType] = useState<"kitchen" | "mart">("kitchen");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formMrp, setFormMrp] = useState(0);
  const [formDiscount, setFormDiscount] = useState(0);
  const [formDesc, setFormDesc] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formVeg, setFormVeg] = useState(true);
  const [formStock, setFormStock] = useState(10);
  const [formSku, setFormSku] = useState("");
  const [formWeightVal, setFormWeightVal] = useState(0);
  const [formWeightUnit, setFormWeightUnit] = useState("g");
  const [formStatus, setFormStatus] = useState<"active" | "inactive" | "draft">("active");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formBestSeller, setFormBestSeller] = useState(false);
  const [formPrepTime, setFormPrepTime] = useState(0);
  const [saving, setSaving] = useState(false);

  const filtered = products?.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p._id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleBulkAction = async (status: "active" | "inactive" | "draft") => {
    try {
      await updateStatus({ ids: Array.from(selected) as any, status });
      toast.success(`${selected.size} products updated to ${status}`);
      setSelected(new Set());
    } catch (e: any) {
      toast.error(e.message || "Bulk action failed");
    }
  };

  const openCreate = () => {
    setFormName(""); setFormSlug(""); setFormBizType("kitchen"); setFormCategory("");
    setFormPrice(0); setFormMrp(0); setFormDiscount(0); setFormDesc(""); setFormShortDesc("");
    setFormVeg(true); setFormStock(10); setFormSku(""); setFormWeightVal(0); setFormWeightUnit("g");
    setFormStatus("active"); setFormFeatured(false); setFormBestSeller(false); setFormPrepTime(0);
    setModal({ open: true });
  };

  const openEdit = (product: any) => {
    setFormName(product.name); setFormSlug(product.slug); setFormBizType(product.businessType);
    setFormCategory(product.categoryId); setFormPrice(product.price); setFormMrp(product.mrp || 0);
    setFormDiscount(product.discount || 0); setFormDesc(product.description || ""); setFormShortDesc(product.shortDescription || "");
    setFormVeg(product.veg); setFormStock(product.stock || 0); setFormSku(product.sku || "");
    setFormWeightVal(product.weightValue || 0); setFormWeightUnit(product.weightUnit || "g");
    setFormStatus(product.status); setFormFeatured(product.isFeatured || false);
    setFormBestSeller(product.isBestSeller || false); setFormPrepTime(product.preparationTime || 0);
    setModal({ open: true, edit: product });
  };

  const handleSave = async () => {
    if (!formName || !formSlug || !formCategory) { toast.error("Name, slug, and category are required"); return; }
    setSaving(true);
    try {
      if (modal.edit) {
        await updateProduct({
          id: modal.edit._id,
          name: formName, slug: formSlug, businessType: formBizType,
          categoryId: formCategory as any, price: formPrice, mrp: formMrp || undefined,
          discount: formDiscount || undefined, description: formDesc || undefined,
          shortDescription: formShortDesc || undefined, veg: formVeg, stock: formStock || undefined,
          sku: formSku || undefined, weightValue: formWeightVal || undefined,
          weightUnit: formWeightUnit || undefined, status: formStatus,
          isFeatured: formFeatured || undefined, isBestSeller: formBestSeller || undefined,
          preparationTime: formPrepTime || undefined,
        });
        toast.success("Product updated");
      } else {
        await createProduct({
          name: formName, slug: formSlug, businessType: formBizType,
          categoryId: formCategory as any, price: formPrice, mrp: formMrp || undefined,
          discount: formDiscount || undefined, description: formDesc || undefined,
          shortDescription: formShortDesc || undefined, veg: formVeg, stock: formStock || undefined,
          sku: formSku || undefined, weightValue: formWeightVal || undefined,
          weightUnit: formWeightUnit || undefined, status: formStatus,
          isFeatured: formFeatured || undefined, isBestSeller: formBestSeller || undefined,
          preparationTime: formPrepTime || undefined,
        });
        toast.success("Product created");
      }
      setModal({ open: false });
    } catch (e: any) {
      toast.error(e.message || "Failed to save product");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeProduct({ id: id as any });
      toast.success("Product deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProduct({ id: id as any });
      toast.success("Product duplicated");
    } catch (e: any) {
      toast.error(e.message || "Failed to duplicate");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search + Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            <button onClick={() => handleBulkAction("active")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">Activate</button>
            <button onClick={() => handleBulkAction("inactive")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">Deactivate</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="w-10 px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-border" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Status</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(product._id)} onChange={() => toggleOne(product._id)} className="rounded border-border" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">{product.images?.[0] ?? "📦"}</div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku ?? "No SKU"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{product.businessType}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">₹{product.price}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock !== undefined && product.stock <= 5 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                      {product.stock ?? "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      product.status === "active" ? "bg-emerald-50 text-emerald-700" :
                      product.status === "inactive" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {product.status === "active" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDuplicate(product._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Duplicate"><Copy className="h-4 w-4" /></button>
                      <button onClick={() => openEdit(product)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(product._id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found. Click "Add Product" to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !saving && setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/60 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit Product" : "Create Product"}</h2>
              <button onClick={() => !saving && setModal({ open: false })} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Product Name *</label>
                  <input value={formName} onChange={e => { setFormName(e.target.value); if (!modal.edit) setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} placeholder="Product name" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Slug *</label>
                  <input value={formSlug} onChange={e => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} placeholder="product-slug" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Business Type *</label>
                  <select value={formBizType} onChange={e => setFormBizType(e.target.value as any)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="kitchen">Kitchen</option>
                    <option value="mart">Mart</option>
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Category *</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">Select category</option>
                    {(categories ?? []).map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Price (₹) *</label>
                  <input type="number" value={formPrice} onChange={e => setFormPrice(parseFloat(e.target.value) || 0)} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">MRP (₹)</label>
                  <input type="number" value={formMrp} onChange={e => setFormMrp(parseFloat(e.target.value) || 0)} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Discount (%)</label>
                  <input type="number" value={formDiscount} onChange={e => setFormDiscount(parseFloat(e.target.value) || 0)} min={0} max={100} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              {/* Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Weight Value</label>
                  <input type="number" value={formWeightVal} onChange={e => setFormWeightVal(parseFloat(e.target.value) || 0)} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Weight Unit</label>
                  <select value={formWeightUnit} onChange={e => setFormWeightUnit(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">L</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>
              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Short Description</label>
                <input value={formShortDesc} onChange={e => setFormShortDesc(e.target.value)} placeholder="Brief description" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Product description" rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              </div>
              {/* Stock & SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Stock</label>
                  <input type="number" value={formStock} onChange={e => setFormStock(parseInt(e.target.value) || 0)} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">SKU</label>
                  <input value={formSku} onChange={e => setFormSku(e.target.value)} placeholder="SKU-001" className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              {/* Status & flags */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select value={formStatus} onChange={e => setFormStatus(e.target.value as any)} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prep Time (min)</label>
                  <input type="number" value={formPrepTime} onChange={e => setFormPrepTime(parseInt(e.target.value) || 0)} min={0} className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-1.5 flex items-end gap-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formVeg} onChange={e => setFormVeg(e.target.checked)} className="rounded border-border" />
                    <span className="text-xs font-medium">Veg</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formFeatured} onChange={e => setFormFeatured(e.target.checked)} className="rounded border-border" />
                    <span className="text-xs font-medium">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formBestSeller} onChange={e => setFormBestSeller(e.target.checked)} className="rounded border-border" />
                    <span className="text-xs font-medium">Best Seller</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/60">
              <button onClick={() => !saving && setModal({ open: false })} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {modal.edit ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
