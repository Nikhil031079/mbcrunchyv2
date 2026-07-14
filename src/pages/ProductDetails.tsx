// MB Crunchy — Product Details Page
import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Star, Heart, Share2, ShoppingBag, Check, ChevronLeft, Clock, Package, Scale, Leaf, Info } from "lucide-react";
import { getAllKitchenProducts, getAllMartProducts } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import ProductCard from "@/components/product/ProductCard";
import { toast } from "sonner";
import type { Product } from "@/data/products";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "nutrition" | "reviews">("description");
  const [imgError, setImgError] = useState(false);

  const allProducts = useMemo(() => [...getAllKitchenProducts(), ...getAllMartProducts()], []);
  const product = allProducts.find(p => p.id === id) ?? null;
  const relatedProducts = useMemo(() =>
    product ? allProducts.filter(p => p.subcategory === product.subcategory && p.id !== product.id).slice(0, 4) : [],
    [product, allProducts]
  );

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

  const originalPrice = product.originalPrice ?? product.price;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
      weight: product.weight,
      veg: product.veg,
      discount: product.discount,
      originalPrice: product.discount > 0 ? originalPrice : product.price,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, text: product.description, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Left — Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden border border-border/40 shadow-sm group"
            >
              {!imgError ? (
                <span className="text-[8rem] sm:text-[10rem] select-none transition-transform duration-500 group-hover:scale-110">{product.image}</span>
              ) : (
                <span className="text-[6rem]">📦</span>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-xs font-bold shadow-lg">-{product.discount}%</span>
                )}
                <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase shadow-md ${product.veg ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                  {product.veg ? "Veg" : "Non-Veg"}
                </span>
              </div>

              {/* Wishlist + Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button onClick={() => { toggleItem({ productId: product.id, name: product.name, price: product.price, originalPrice, image: product.image, weight: product.weight, veg: product.veg, inStock: product.inStock, addedAt: Date.now() }); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg transition-all hover:scale-105 active:scale-90 ${wishlisted ? "text-red-500" : "text-foreground"}`}>
                  <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
                </button>
                <button onClick={handleShare} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg transition-all hover:scale-105 active:scale-90">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right — Product Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5">
                  <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{product.subcategory}</span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span>{product.weight}</span>
                </div>
                {product.isCombo && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Combo</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mt-6 flex items-end gap-3">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">₹{originalPrice}</span>
                    <span className="rounded-lg bg-red-50 text-red-700 px-2 py-0.5 text-xs font-bold">Save ₹{originalPrice - product.price}</span>
                  </>
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

              {/* Quantity + Add to Cart */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-border bg-white shadow-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-l-xl text-lg font-medium">−</button>
                  <span className="flex h-11 w-14 items-center justify-center text-sm font-semibold border-x border-border">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-r-xl text-lg font-medium">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  <ShoppingBag className="h-5 w-5" /> Add to Cart
                </button>
              </div>
            </motion.div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-3 flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <div><p className="text-xs font-semibold">Delivery in</p><p className="text-xs text-muted-foreground">30-45 mins</p></div>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-3 flex items-center gap-3">
                <Leaf className="h-5 w-5 text-amber-600" />
                <div><p className="text-xs font-semibold">Fresh</p><p className="text-xs text-muted-foreground">Made to order</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs — Description / Ingredients / Nutrition */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-border/60">
            {(["description", "ingredients", "nutrition", "reviews"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="py-6">
            {activeTab === "description" && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{product.description}</p>
            )}
            {activeTab === "ingredients" && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Fresh ingredients prepared with care. All items are made in our hygienic kitchen.</p>
                <p className="text-xs text-muted-foreground/60 mt-4">For detailed ingredient information, please contact us.</p>
              </div>
            )}
            {activeTab === "nutrition" && (
              <div className="text-sm text-muted-foreground space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Energy", value: "—" },
                    { label: "Protein", value: "—" },
                    { label: "Carbs", value: "—" },
                    { label: "Fat", value: "—" },
                  ].map(n => (
                    <div key={n.label} className="rounded-xl bg-muted/30 p-4 text-center border border-border/40">
                      <p className="text-lg font-bold text-foreground">{n.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 mt-2">Approximate values. Actual nutritional content may vary.</p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-8">
                <Star className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Reviews coming soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <ProductCard product={p} index={i} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
