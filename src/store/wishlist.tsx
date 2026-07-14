// MB Crunchy — Wishlist Store (Prepared for future implementation)
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { WishlistItem, WishlistState } from "@/types";

interface WishlistContextValue {
  state: WishlistState;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const initialState: WishlistState = {
  items: [],
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state] = useState<WishlistState>(initialState);

  const addItem = useCallback((_item: WishlistItem) => {
    console.log("[Wishlist] addItem — not implemented yet", _item);
  }, []);

  const removeItem = useCallback((_productId: string) => {
    console.log("[Wishlist] removeItem — not implemented yet", _productId);
  }, []);

  const isInWishlist = useCallback((_productId: string): boolean => {
    return false;
  }, []);

  const toggleItem = useCallback((_item: WishlistItem) => {
    console.log("[Wishlist] toggleItem — not implemented yet", _item);
  }, []);

  const clearWishlist = useCallback(() => {
    console.log("[Wishlist] clearWishlist — not implemented yet");
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      state,
      addItem,
      removeItem,
      isInWishlist,
      toggleItem,
      clearWishlist,
      count: 0,
    }),
    [state, addItem, removeItem, isInWishlist, toggleItem, clearWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
