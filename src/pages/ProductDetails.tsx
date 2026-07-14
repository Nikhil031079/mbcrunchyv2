// MB Crunchy — Product Details Page (Convex-Powered)
import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Star, Heart, Share2, ShoppingBag, Check, ChevronLeft, Clock, Package, Scale, Leaf, Info, AlertTriangle, Thermometer, Flame, Loader2 } from "lucide-react";
import { mapConvexProduct } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import ProductCard from "@/components/product/ProductCard";
import { toast } from "sonner";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const productDoc = useQuery(api.products.getById, { id: id as any });
  const allProducts = useQuery(api.products.list, {});

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "nutrition" | "reviews">("description");
  const [activeImage, setActiveImage] = useState(0);

  const product = productDoc ? mapConvexProduct(productDoc) : null;
  const wishlisted = product ? isInWishlist(product.id) : false;
  const hasGallery = product && product.gallery && product.gallery.length > 0;
  const allImages = product ? [product.image, ...(product.gallery || [])].filter(Boolean) : [];

  // Related products (same category, different product)
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter(p => p.categoryId === product.categoryId && p._id !== product.id && p.status === "active")
      .slice(0, 4)
      .map(p => mapConvexProduct(p));
  }, [product, allProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: qty, image: product.image, weight: product.weight, veg: product.veg, discount: product.discount, originalPrice: product.originalPrice || product.price });
    toast.success(`${product.name} added to cart!`);
  };

  const handleShare = async () => {
    if (navigator.share) { await navigator.share({ title: product?.name || "", text: product?.description, url: window.location.href }); }
    else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
  };

  if (!productDoc && id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-xl font-bold mb-2">Product not found</h1>
        <p className="text-sm text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/kitchen" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Browse Kitchen</Link>
      </div>
    );
  }

  const tabs = [
    { key: "description" as const, label: "Description", show: true },
    { key: "ingredients" as const, label: "Ingredients", show: !!product.ingredients },
    { key: "nutrition" as const, label: "Nutrition", show: !!product.nutrition },
    { key: "reviews" as const, label: "Reviews", show: false },
  ].filter(t => t.show);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left — Image Gallery */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden border border-border/40 shadow-sm group">
              {allImages.length > 0 && allImages[activeImage] && !allImages[activeImage].startsWith("📦") ? (
                <img src={allImages[activeImage]} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <span className="text-[8rem] sm:text-[10rem] select-none">{product.image}</span>
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount > 0 && <span className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-xs font-bold shadow-lg">-{product.discount}%</span>}
                <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase shadow-md ${product.veg ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>{product.veg ? "Veg" : "Non-Veg"}</span>
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button onClick={() => { toggleItem({ productId: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice || product.price, image: product.image, weight: product.weight, veg: product.veg, inStock: product.inStock, addedAt: Date.now() }); toast.success(wishlisted ? "Removed" : "Added to wishlist"); }}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg transition-all hover:scale-105 active:scale-90 ${wishlisted ? "text-red-500" : "text-foreground"}`}>
                  <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
                </button>
                <button onClick={handleShare} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg transition-all hover:scale-105 active:scale-90">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Thumbnail gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`shrink-0 h-16 w-16 rounded-xl border-2 overflow-hidden transition-all ${activeImage === i ? "border-primary" : "border-border/60 hover:border-muted-foreground/30"}`}>
                    {img && !img.startsWith("📦") ? (
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted text-lg">{product.image}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {product.weight && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Scale className="h-4 w-4" /><span>{product.weight}</span>
                  </div>
                )}
                {product.preparationTime && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /><span>{product.preparationTime} min prep</span>
                  </div>
                )}
                {product.spicyLevel && product.spicyLevel !== "mild" && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Flame className="h-4 w-4 text-red-500" /><span className="capitalize">{product.spicyLevel}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              )}

              {/* Pricing */}
              <div className="mt-6 flex items-end gap-3">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <><span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                    <span className="rounded-lg bg-red-50 text-red-700 px-2 py-0.5 text-xs font-bold">Save ₹{product.originalPrice - product.price}</span></>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Quantity + Add to Cart */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-border bg-white shadow-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-l-xl text-lg font-medium">−</button>
                  <span className="flex h-11 w-14 items-center justify-center text-sm font-semibold border-x border-border">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-r-xl text-lg font-medium">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={!product.inStock}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  <ShoppingBag className="h-5 w-5" /> {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>

              {/* Delivery/Storage Info */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {product.storageInstructions && (
                  <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-3 flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-blue-600 shrink-0" />
                    <div><p className="text-xs font-semibold">Storage</p><p className="text-[10px] text-muted-foreground">{product.storageInstructions}</p></div>
                  </div>
                )}
                {product.shelfLife && (
                  <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-3 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                    <div><p className="text-xs font-semibold">Shelf Life</p><p className="text-[10px] text-muted-foreground">{product.shelfLife}</p></div>
                  </div>
                )}
              </div>

              {/* Allergens */}
              {product.allergens && (
                <div className="rounded-xl bg-red-50/50 border border-red-100 p-3 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div><p className="text-xs font-semibold text-red-700">Allergen Information</p><p className="text-[10px] text-red-600/80">{product.allergens}</p></div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-border/60 overflow-x-auto">
            {tabs.length > 0 ? tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab.label}
              </button>
            )) : (
              <button className="px-4 py-3 text-sm font-medium border-b-2 border-primary text-primary">Description</button>
            )}
          </div>
          <div className="py-6">
            {activeTab === "description" && (
              <div className="max-w-2xl space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                {product.shortDescription && <p className="text-sm text-muted-foreground">{product.shortDescription}</p>}
                {product.servingSize && <p className="text-sm text-muted-foreground"><strong>Serving Size:</strong> {product.servingSize}</p>}
              </div>
            )}
            {activeTab === "ingredients" && product.ingredients && (
              <div className="text-sm text-muted-foreground max-w-2xl whitespace-pre-wrap">{product.ingredients}</div>
            )}
            {activeTab === "nutrition" && product.nutrition && (
              <div className="text-sm text-muted-foreground max-w-2xl whitespace-pre-wrap">{product.nutrition}</div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-8"><Star className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">Reviews coming soon!</p></div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <Link key={p.id} to={`/product/${p.id}`}><ProductCard product={p} index={i} /></Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
