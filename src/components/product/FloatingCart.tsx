// MB Crunchy — Mobile Floating Cart Button
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";

export default function FloatingCart() {
  return (
    <Link
      to="/checkout"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-200 hover:bg-primary/90 active:scale-90 lg:hidden"
      aria-label="View cart"
    >
      <ShoppingBag className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground shadow">
        0
      </span>
    </Link>
  );
}
