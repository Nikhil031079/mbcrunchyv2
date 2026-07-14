// MB Crunchy — Checkout Page (Placeholder)
import { ShoppingCart } from "lucide-react";

export default function Checkout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-primary text-primary-foreground">
            <ShoppingCart className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Review your order, add delivery details, and complete your purchase.
            Secure checkout with multiple payment options.
          </p>
          <div className="mt-8 h-48 w-full max-w-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        </div>
      </div>
    </div>
  );
}
