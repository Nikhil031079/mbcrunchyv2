// MB Crunchy — Wishlist Store (Full Implementation with localStorage)
import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import type { WishlistItem } from "@/types";

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "mb-crunchy-wishlist";

function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems(prev => {
      if (prev.find(i => i.productId === item.productId)) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string): boolean => {
    return items.some(i => i.productId === productId);
  }, [items]);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.productId === item.productId);
      if (exists) return prev.filter(i => i.productId !== item.productId);
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist, count: items.length }),
    [items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
