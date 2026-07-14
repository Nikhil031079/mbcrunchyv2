// MB Crunchy — Product Details Page (Placeholder)
import { Package } from "lucide-react";

export default function ProductDetails() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-primary text-primary-foreground">
            <Package className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Product Details
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Detailed product information, nutritional facts, and customer reviews.
            Select quantity and add to cart.
          </p>
          <div className="mt-8 h-48 w-full max-w-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Select a product to view details</p>
          </div>
        </div>
      </div>
    </div>
  );
}
