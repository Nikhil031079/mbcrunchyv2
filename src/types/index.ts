// MB Crunchy — Type Definitions

// ─── Cart Types ──────────────────────────────────────────────
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: string;
  veg: boolean;
  discount: number;
  originalPrice: number;
}

export interface CartState {
  items: CartItem[];
}

// ─── Wishlist Types ──────────────────────────────────────────
export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  weight: string;
  veg: boolean;
  inStock: boolean;
  addedAt: number;
}

export interface WishlistState {
  items: WishlistItem[];
}

// ─── User Types ──────────────────────────────────────────────
export type UserRole = "customer" | "admin" | "manager";

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 969 characters. Read it separately or use code_search for the relevant section.