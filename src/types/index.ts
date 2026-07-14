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

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  addresses: UserAddress[];
  createdAt: number;
}

// ─── Settings Types ──────────────────────────────────────────
export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeMode;
  language: string;
  notifications: boolean;
  smsUpdates: boolean;
  emailUpdates: boolean;
  locationEnabled: boolean;
}

// ─── Order Types ─────────────────────────────────────────────
export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "out-for-delivery" | "completed" | "cancelled";
export type PaymentMethod = "cash" | "upi";
export type OrderType = "delivery" | "takeaway";

export interface CheckoutCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface CheckoutAddress {
  houseNo: string;
  street: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CheckoutState {
  step: number;
  customer: CheckoutCustomer;
  orderType: OrderType;
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  upiReference: string;
  notes: string;
}

// ─── Navigation Types ────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
}
