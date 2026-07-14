// MB Crunchy — Admin Products Management (Full Business Edition)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Search, Plus, Edit, Trash2, Copy, CheckCircle, XCircle, Loader2, X,
  FileDown, FileUp, Upload
} from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminProducts() {
  const products = useQuery(api.products.list, {});
  const categories = useQuery(api.categories.list, {});
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const updateStatus = useMutation(api.products.updateStatus);
  const removeProduct = useMutation(api.products.remove);
  const duplicate = useMutation(api.products.duplicate);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });

  // Form state — all business fields
  const [f, setF] = useState<Record<string, any>>({
    name: "", slug: "", businessType: "kitchen", categoryId: "",
    price: 0, mrp: 0, discount: 0, stock: 10, sku: "", barcode: "",
    weightValue: 0, weightUnit: "g",
    shortDescription: "", description: "", ingredients: "", nutrition: "",
    allergens: "", storageInstructions: "", shelfLife: "",
    spicyLevel: "mild", servingSize: "",
    veg: true, isFeatured: false, isBestSeller: false,
    isNewArrival: false, isTrending: false, isRecommended: false,
    preparationTime: 0, status: "active",
    images: [] as string[], gallery: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  // ESC closes modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape" && modal.open && !saving) { setModal({ open: false }); document.body.style.overflow = ""; }};
    if (modal.open) { document.addEventListener("keydown", handleEsc); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [modal.open, saving]);

  const filtered = products?.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const openCreate = () => {
    setF({
      name: "", slug: "", businessType: "kitchen", categoryId: "",
      price: 0, mrp: 0, discount: 0, stock: 10, sku: "", barcode: "",
      weightValue: 0, weightUnit: "g",
      shortDescription: "", description: "", ingredients: "", nutrition: "",
      allergens: "", storageInstructions: "", shelfLife: "",
      spicyLevel: "mild", servingSize: "",
      veg: true, isFeatured: false, isBestSeller: false,
      isNewArrival: false, isTrending: false, isRecommended: false,
      preparationTime: 0, status: "active",
      images: [] as string[], gallery: [] as string[],
    });
    setModal({ open: true });
  };

  const openEdit = (p: any) => {
    setF({
      name: p.name, slug: p.slug, businessType: p.businessType, categoryId: p.categoryId || "",
      price: p.price, mrp: p.mrp || 0, discount: p.discount || 0, stock: p.stock ?? 0, sku: p.sku || "", barcode: p.barcode || "",
      weightValue: p.weightValue || 0, weightUnit: p.weightUnit || "g",
      shortDescription: p.shortDescription || "", description: p.description || "",
      ingredients: p.ingredients || "", nutrition: p.nutrition || "",
      allergens: p.allergens || "", storageInstructions: p.storageInstructions || "",
      shelfLife: p.shelfLife || "", spicyLevel: p.spicyLevel || "mild",
      servingSize: p.servingSize || "",
      veg: p.veg ?? true, isFeatured: p.isFeatured || false, isBestSeller: p.isBestSeller || false,
      isNewArrival: p.isNewArrival || false, isTrending: p.isTrending || false,
      isRecommended: p.isRecommended || false,
      preparationTime: p.preparationTime || 0, status: p.status,
      images: p.images || [], gallery: p.gallery || [],
    });
    setModal({ open: true, edit: p });
  };

  const validate = () => {
    if (!f.name) { toast.error("Name is required"); return false; }
    if (!f.slug) { toast.error("Slug is required"); return false; }
    if (!f.categoryId) { toast.error("Category is required"); return false; }
    if (!f.price || f.price <= 0) { toast.error("Valid price is required"); return false; }
    if (!f.images || f.images.length === 0) { toast.error("At least one product image is required"); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        name: f.name, slug: f.slug, businessType: f.businessType,
        categoryId: f.categoryId as any,
        price: f.price, mrp: f.mrp || undefined, discount: f.discount || undefined,
        stock: f.stock || undefined, sku: f.sku || undefined,
        weightValue: f.weightValue || undefined, weightUnit: f.weightUnit || undefined,
        shortDescription: f.shortDescription || undefined,
        description: f.description || undefined,
        ingredients: f.ingredients || undefined,
        nutrition: f.nutrition || undefined,
        allergens: f.allergens || undefined,
        storageInstructions: f.storageInstructions || undefined,
        shelfLife: f.shelfLife || undefined,
        spicyLevel: f.spicyLevel && f.spicyLevel !== "mild" ? f.spicyLevel : undefined,
        servingSize: f.servingSize || undefined,
        veg: f.veg,
        isFeatured: f.isFeatured || undefined,
        isBestSeller: f.isBestSeller || undefined,
        isNewArrival: f.isNewArrival || undefined,
        isTrending: f.isTrending || undefined,
        isRecommended: f.isRecommended || undefined,
        preparationTime: f.preparationTime || undefined,
        status: f.status,
        images: f.images.length > 0 ? f.images : undefined,
        gallery: f.gallery.length > 0 ? f.gallery : undefined,
      };

      if (modal.edit) {
        await updateProduct({ id: modal.edit._id, ...data });
        toast.success("Product updated successfully");
      } else {
        await createProduct(data as any);
        toast.success("Product created successfully");
      }
      setModal({ open: false }); document.body.style.overflow = "";
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

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
    try { await updateStatus({ ids: Array.from(selected) as any, status }); toast.success(`${selected.size} products updated`); setSelected(new Set()); }
    catch (e: any) { toast.error(e.message); }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!products || products.length === 0) { toast.error("No products to export"); return; }
    const headers = ["Name","SKU","Category","Price","MRP","Stock","Status","Type","Veg","Weight","Unit","Slug"];
    const rows = products.map(p => [
      p.name, p.sku || "", p.categoryId || "", p.price, p.mrp || "", p.stock ?? "", p.status, p.businessType,
      p.veg ? "Yes" : "No", p.weightValue || "", p.weightUnit || "", p.slug
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `products-export-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  // Update slug from name for new products
  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const renderField = (label: string, field: string, opts?: any) => (
    <div className="space-y-1" key={field}>
      <label className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</label>
      {opts?.textarea ? (
        <textarea value={f[field] || ""} onChange={e => setF({...f, [field]: e.target.value})} rows={opts.rows || 2}
          placeholder={opts.placeholder || ""} className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      ) : opts?.select ? (
        <select value={f[field] || opts.default || ""} onChange={e => setF({...f, [field]: e.target.value})}
          className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {opts.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : opts?.number ? (
        <input type="number" value={f[field] ?? 0} onChange={e => setF({...f, [field]: parseFloat(e.target.value) || 0})} min={0}
          className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      ) : (
        <input value={f[field] || ""} onChange={e => setF({...f, [field]: e.target.value})} placeholder={opts?.placeholder || ""}
          className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold tracking-tight">Products</h1><p className="text-sm text-muted-foreground">{products?.length ?? 0} products</p></div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition-all">
            <FileDown className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Search + Bulk */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            <button onClick={() => handleBulkAction("active")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Activate</button>
            <button onClick={() => handleBulkAction("inactive")} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">Deactivate</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border/60 bg-muted/20">
              <th className="w-10 px-4 py-3 text-left"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-border" /></th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Price / MRP</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-[10px] uppercase">Status</th>
              <th className="w-24 px-4 py-3" /></tr></thead>
            <tbody>{filtered.map(p => (<tr key={p._id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleOne(p._id)} className="rounded border-border" /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg overflow-hidden">
                    {p.images?.[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : "📦"}
                  </div>
                  <div className="min-w-0"><p className="font-medium truncate">{p.name}</p><p className="text-[10px] text-muted-foreground truncate">{p.sku || "No SKU"}</p></div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap"><span className="font-semibold">₹{p.price}</span>{p.mrp && p.mrp > p.price && <span className="ml-1 text-[10px] text-muted-foreground line-through">₹{p.mrp}</span>}</td>
              <td className="px-4 py-3"><span className={p.stock !== undefined && p.stock <= 5 ? "text-red-600 font-medium" : "text-muted-foreground"}>{p.stock ?? "N/A"}</span></td>
              <td className="px-4 py-3 text-muted-foreground capitalize text-[10px]">{p.businessType}{!p.veg && " 🥩"}</td>
              <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${p.status === "active" ? "bg-emerald-50 text-emerald-700" : p.status === "inactive" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{p.status === "active" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}{p.status}</span></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={async () => { try { await duplicate({ id: p._id as any }); toast.success("Duplicated"); } catch(e: any) { toast.error(e.message); }}} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted" title="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                  <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                  <button onClick={async () => { try { await removeProduct({ id: p._id as any }); toast.success("Deleted"); } catch(e: any) { toast.error(e.message); }}} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </td>
            </tr>))}{filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found.</td></tr>}</tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 bg-black/40"
          onClick={() => { if (!saving) { setModal({ open: false }); document.body.style.overflow = ""; }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-3xl mx-4 my-auto"
            onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-border/60 rounded-t-2xl">
              <h2 className="text-lg font-semibold">{modal.edit ? "Edit Product" : "Create Product"}</h2>
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* ═══ Image Upload ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-4">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Product Images</h3>
                <ImageUpload
                  label="Main Image (required)"
                  value={f.images}
                  onChange={(v) => setF({...f, images: Array.isArray(v) ? v : [v]})}
                  multiple={false} maxFiles={1}
                />
                <ImageUpload
                  label="Gallery Images (optional)"
                  value={f.gallery}
                  onChange={(v) => setF({...f, gallery: Array.isArray(v) ? v : []})}
                  multiple maxFiles={8} maxSizeMB={2}
                />
              </div>

              {/* ═══ Basic Info ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderField("Product Name *", "name", { placeholder: "Veg Burger" })}
                  {renderField("Slug *", "slug", { placeholder: "veg-burger" })}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {renderField("Business Type *", "businessType", { select: true, options: [{value:"kitchen",label:"Kitchen"},{value:"mart",label:"Mart"}] })}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Category *</label>
                    <select value={f.categoryId} onChange={e => setF({...f, categoryId: e.target.value})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="">Select category</option>
                      {(categories ?? []).map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  {renderField("SKU", "sku", { placeholder: "BURG-001" })}
                </div>
              </div>

              {/* ═══ Pricing ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Pricing</h3>
                <div className="grid grid-cols-3 gap-3">
                  {renderField("Price (₹) *", "price", { number: true })}
                  {renderField("MRP (₹)", "mrp", { number: true })}
                  {renderField("Discount (%)", "discount", { number: true })}
                </div>
              </div>

              {/* ═══ Weight & Stock ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Weight & Inventory</h3>
                <div className="grid grid-cols-4 gap-3">
                  {renderField("Weight", "weightValue", { number: true })}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Unit</label>
                    <select value={f.weightUnit} onChange={e => setF({...f, weightUnit: e.target.value})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="g">g</option><option value="kg">kg</option>
                      <option value="ml">ml</option><option value="l">L</option><option value="pcs">pcs</option>
                    </select>
                  </div>
                  {renderField("Stock", "stock", { number: true })}
                  {renderField("Barcode", "barcode", { placeholder: "8901234567890" })}
                </div>
              </div>

              {/* ═══ Labels & Tags ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Labels & Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    {key:"veg", label:"🌿 Veg"},
                    {key:"isFeatured", label:"⭐ Featured"},
                    {key:"isBestSeller", label:"🏆 Best Seller"},
                    {key:"isNewArrival", label:"🆕 New Arrival"},
                    {key:"isTrending", label:"🔥 Trending"},
                    {key:"isRecommended", label:"👍 Recommended"},
                  ].map(({key,label}) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer rounded-lg border border-border/60 px-3 py-2 hover:bg-muted/20 transition-colors">
                      <input type="checkbox" checked={f[key]} onChange={e => setF({...f, [key]: e.target.checked})} className="rounded border-border" />
                      <span className="text-xs font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ═══ Descriptions ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Descriptions</h3>
                {renderField("Short Description", "shortDescription", { placeholder: "Brief tagline", textarea: true, rows: 1 })}
                {renderField("Full Description", "description", { placeholder: "Detailed product description", textarea: true, rows: 3 })}
              </div>

              {/* ═══ Food Details ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Food Details</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Spicy Level</label>
                    <select value={f.spicyLevel} onChange={e => setF({...f, spicyLevel: e.target.value})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="mild">🌱 Mild</option>
                      <option value="medium">🌶️ Medium</option>
                      <option value="hot">🌶️🌶️ Hot</option>
                      <option value="extra-hot">🌶️🌶️🌶️ Extra Hot</option>
                    </select>
                  </div>
                  {renderField("Prep Time (min)", "preparationTime", { number: true })}
                  {renderField("Serving Size", "servingSize", { placeholder: "1 piece" })}
                </div>
                {renderField("Ingredients", "ingredients", { textarea: true, rows: 2, placeholder: "List of ingredients" })}
                {renderField("Nutritional Information", "nutrition", { textarea: true, rows: 2, placeholder: "Calories, protein, fat, etc." })}
                {renderField("Allergen Information", "allergens", { textarea: true, rows: 2, placeholder: "Contains: milk, eggs, nuts, etc." })}
              </div>

              {/* ═══ Storage ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Storage & Shelf Life</h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderField("Storage Instructions", "storageInstructions", { placeholder: "Keep refrigerated at 4°C" })}
                  {renderField("Shelf Life", "shelfLife", { placeholder: "6 months from date of packaging" })}
                </div>
              </div>

              {/* ═══ Status ═══ */}
              <div className="rounded-xl border border-border/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Status</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Status</label>
                    <select value={f.status} onChange={e => setF({...f, status: e.target.value})}
                      className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-border/60 rounded-b-2xl">
              <button onClick={() => { setModal({ open: false }); document.body.style.overflow = ""; }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}{modal.edit ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
