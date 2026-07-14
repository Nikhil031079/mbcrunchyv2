// MB Crunchy — Offline Fallback Page
import { Link } from "react-router";
import { WifiOff, RefreshCw } from "lucide-react";

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted mx-auto mb-6">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-sm text-muted-foreground mb-2 max-w-sm mx-auto">
          It looks like you've lost your internet connection. Don't worry — your cart is saved locally.
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          Once you're back online, you can continue shopping and place your order.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
