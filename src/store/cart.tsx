// MB Crunchy — Cart Store (Prepared for future implementation)
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { CartItem, CartState } from "@/types";

interface CartContextValue {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const initialState: CartState = {
  items: [],
  restaurantNote: undefined,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state] = useState<CartState>(initialState);

  const addItem = useCallback((_item: CartItem) => {
    console.log("[Cart] addItem — not implemented yet", _item);
  }, []);

  const removeItem = useCallback((_productId: string) => {
    console.log("[Cart] removeItem — not implemented yet", _productId);
  }, []);

  const updateQuantity = useCallback((_productId: string, _quantity: number) => {
    console.log("[Cart] updateQuantity — not implemented yet", _productId, _quantity);
  }, []);

  const clearCart = useCallback(() => {
    console.log("[Cart] clearCart — not implemented yet");
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount: 0,
      subtotal: 0,
    }),
    [state, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
