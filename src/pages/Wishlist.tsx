// MB Crunchy — Wishlist Page (Placeholder)
import { Heart } from "lucide-react";

export default function Wishlist() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-primary text-primary-foreground">
            <Heart className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Your Wishlist
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Save your favorite products and come back to them anytime.
            Your wishlist makes it easy to track items you love.
          </p>
          <div className="mt-8 h-48 w-full max-w-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
          </div>
        </div>
      </div>
    </div>
  );
}
