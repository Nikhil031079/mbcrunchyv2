// MB Crunchy — Reusable Product Card (Store-Connected)
import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const originalPrice = product.originalPrice ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      weight: product.weight,
      veg: product.veg,
      discount: product.discount,
      originalPrice: product.discount > 0 ? originalPrice : product.price,
    });
    toast.success(`${product.name} added to cart!`, { duration: 2000 });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice,
      image: product.image,
      weight: product.weight,
      veg: product.veg,
      inStock: product.inStock,
      addedAt: Date.now(),
    });
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist", { duration: 2000 });
  };

  return (
    <Link to={`/product/${product.id}`} onClick={(e) => { if (!product.id) e.preventDefault(); }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 4) * 0.06, duration: 0.4 }}
        className="group relative rounded-2xl bg-white border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      >
        {/* Image Area */}
        <div className="relative aspect-square rounded-t-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
          <motion.span
            className={`text-5xl sm:text-6xl select-none transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            {product.image}
          </motion.span>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-md">
              -{product.discount}%
            </span>
          )}

          {/* Veg/Non-Veg Badge */}
          <span
            className={`absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              product.veg ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${product.veg ? "bg-emerald-500" : "bg-red-500"}`} />
          </span>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-2xl">
              <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-muted-foreground">Out of Stock</span>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-2xl">
            <button
              onClick={(e) => { e.preventDefault(); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-90"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg transition-all duration-200 active:scale-90 ${
                wishlisted ? "text-red-500" : "text-foreground hover:text-red-500"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5">
              <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
              <span className="text-[11px] font-semibold text-emerald-700">{product.rating}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
          </div>

          <h3 className="text-sm font-semibold leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.weight}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {product.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground uppercase">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price + Cart */}
          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <span className="text-base font-bold">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground line-through">₹{originalPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-primary/90 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
