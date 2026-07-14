// MB Crunchy — Order Tracking Page (Placeholder)
import { Truck } from "lucide-react";

export default function OrderTracking() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-accent text-accent-foreground">
            <Truck className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Enter your order number to track your delivery in real-time.
            Stay updated on your order status from kitchen to doorstep.
          </p>
          <div className="mt-8 flex w-full max-w-md gap-2">
            <input
              type="text"
              placeholder="Enter order number"
              className="flex-1 border-2 border-black px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="border-2 border-black bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Track
            </button>
          </div>
          <div className="mt-8 h-32 w-full max-w-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Order tracking coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
