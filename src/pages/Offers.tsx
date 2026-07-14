// MB Crunchy — Offers Page (Placeholder)
import { Tags } from "lucide-react";

export default function Offers() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-accent text-accent-foreground">
            <Tags className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Offers & Deals
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Exciting discounts and combo offers on your favorite products.
            Save more with MB Crunchy deals.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Combo Offers", "Festive Deals", "First Order", "Bulk Discount"].map(
              (tag) => (
                <span
                  key={tag}
                  className="border border-black bg-muted px-3 py-1 text-xs font-bold uppercase"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
          <div className="mt-8 h-48 w-full max-w-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Offers coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
