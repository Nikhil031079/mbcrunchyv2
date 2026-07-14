// MB Crunchy — Wishlist Page
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export default function Wishlist() {
  const { items, removeItem, clearWishlist, count } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      weight: item.weight,
      veg: item.veg,
      discount: item.originalPrice > item.price ? Math.round((1 - item.price / item.originalPrice) * 100) : 0,
      originalPrice: item.originalPrice,
    });
    removeItem(item.productId);
    toast.success("Moved to cart!");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-rose-50 mb-6">
          <Heart className="h-10 w-10 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">Save your favorite items here and come back anytime!</p>
        <Link to="/kitchen" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              Wishlist
            </h1>
            <p className="text-sm text-muted-foreground">{count} {count === 1 ? "item" : "items"} saved</p>
          </div>
          <button onClick={() => { clearWishlist(); toast.success("Wishlist cleared"); }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all">
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item.productId} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group rounded-2xl bg-white border border-border/60 p-4 shadow-sm hover:shadow-md transition-all">
                <div className="relative flex items-center justify-center h-32 rounded-xl bg-gradient-to-br from-muted/50 to-muted mb-3">
                  <span className="text-5xl">{item.image}</span>
                  <span className={`absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border ${item.veg ? "border-emerald-400" : "border-red-400"}`}>
                    <span className={`h-2 w-2 rounded-full ${item.veg ? "bg-emerald-500" : "bg-red-500"}`} />
                  </span>
                </div>
                <h3 className="text-sm font-semibold line-clamp-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.weight}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold text-lg">₹{item.price}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleMoveToCart(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-95">
                    <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                  <button onClick={() => { removeItem(item.productId); toast.success("Removed"); }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
