// MB Crunchy — Cart Page
import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, Tag, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, itemCount, subtotal, savings, deliveryFee, total } = useCart();
  const { addItem } = useWishlist();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const handleMoveToWishlist = (item: typeof items[0]) => {
    addItem({ productId: item.productId, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, weight: item.weight, veg: item.veg, inStock: true, addedAt: Date.now() });
    removeItem(item.productId);
    toast.success("Moved to wishlist");
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
      toast.success("Coupon applied!");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">Looks like you haven't added anything yet. Let's fix that!</p>
        <div className="flex gap-3">
          <Link to="/kitchen" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">Browse Kitchen</Link>
          <Link to="/mart" className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold hover:bg-muted transition-all">Shop Mart</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Cart</h1>
            <p className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <button onClick={() => { clearCart(); toast.success("Cart cleared"); }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.productId} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="group rounded-2xl bg-white border border-border/60 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 text-4xl border border-border/40">
                      {item.image}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.weight}</p>
                        </div>
                        <span className={`shrink-0 flex h-4 w-4 items-center justify-center rounded-full border ${item.veg ? "border-emerald-400" : "border-red-400"}`}>
                          <span className={`h-2 w-2 rounded-full ${item.veg ? "bg-emerald-500" : "bg-red-500"}`} />
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                        {item.discount > 0 && (
                          <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice * item.quantity}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center rounded-lg border border-border bg-white">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-l-lg">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="flex h-9 w-10 items-center justify-center text-xs font-semibold border-x border-border">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-r-lg">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleMoveToWishlist(item)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all text-xs">
                            Save
                          </button>
                          <button onClick={() => { removeItem(item.productId); toast.success("Item removed"); }}
                            className="rounded-lg p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon */}
            <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code" disabled={couponApplied}
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
                <button onClick={handleApplyCoupon} disabled={couponApplied || !couponCode.trim()}
                  className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                  {couponApplied ? "Applied ✓" : "Apply"}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white border border-border/60 p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Savings</span>
                    <span className="font-medium">−₹{savings}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">Applied ✓</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">{deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="border-t border-border/60 pt-3 flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">₹{total}</span>
                </div>
              </div>

              {subtotal < 199 && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800 flex items-center gap-2">
                  <Truck className="h-4 w-4 shrink-0" />
                  Add ₹{199 - subtotal} more for free delivery!
                </div>
              )}

              <Link to="/checkout" className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
                Proceed to Checkout
              </Link>

              <div className="flex items-center gap-3 text-xs text-muted-foreground justify-center">
                <div className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Secure</div>
                <div className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Fast</div>
                <div className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> COD + UPI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
