// MB Crunchy — Combo & Party Pack Card (Convex-Ready)
import { motion } from "framer-motion";
import { CheckCircle, Users, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import type { Product } from "@/data/products";

interface ComboCardProps {
  product: Product;
  index?: number;
}

export default function ComboCard({ product, index = 0 }: ComboCardProps) {
  const { addItem } = useCart();
  const originalPrice = product.originalPrice ?? product.price;
  const hasImage = product.image && !product.image.startsWith("🎁") && !product.image.startsWith("🎉");

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, weight: product.weight, veg: product.veg, discount: product.discount, originalPrice });
    toast.success(`${product.name} added to cart!`, { duration: 2000 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index || 0) * 0.08, duration: 0.4 }}
      className="group rounded-2xl bg-white border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-[2/1] bg-gradient-to-br from-primary/5 via-accent/5 to-muted flex items-center justify-center overflow-hidden">
          {hasImage ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl sm:text-7xl select-none">{product.image}</span>
          )}
        </div>
        {product.savings && product.savings > 0 && (
          <div className="absolute top-3 left-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 text-xs font-bold shadow-lg">Save ₹{product.savings}</div>
        )}
        {product.weight && (
          <div className="absolute top-3 right-3 rounded-xl bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-sm">{product.weight}</div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-base font-bold leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{product.description}</p>

        {product.comboItems && product.comboItems.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground/70">Includes:</p>
            {product.comboItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {product.isPartyPack && product.partyPackServes && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>Serves <strong>{product.partyPackServes}</strong> people</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">₹{product.price}</span>
            {product.discount > 0 && originalPrice > product.price && (
              <span className="ml-2 text-sm text-muted-foreground line-through">₹{originalPrice}</span>
            )}
            {product.savings && product.savings > 0 && (
              <p className="text-xs text-emerald-600 font-medium mt-0.5">You save ₹{product.savings}!</p>
            )}
          </div>
          <button onClick={handleAddToCart} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-primary/90 active:scale-95">
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
