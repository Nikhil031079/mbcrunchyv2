// MB Crunchy — Type Definitions

// ─── Product Types ───────────────────────────────────────────
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: ProductCategory;
  subcategory?: string;
  tags: string[];
  unit: string;
  weight?: string;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  isOrganic: boolean;
  rating: number;
  reviewCount: number;
  createdAt: number;
  updatedAt: number;
}

export type ProductCategory =
  | "frozen-foods"
  | "fast-food"
  | "homemade-snacks"
  | "pickles"
  | "cold-pressed-oils"
  | "natural-honey"
  | "organic-products"
  | "party-packs"
  | "combo-meals";

export interface ProductReview {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

// ─── Cart Types ──────────────────────────────────────────────
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  weight?: string;
}

export interface CartState {
  items: CartItem[];
  restaurantNote?: string;
}

// ─── Wishlist Types ──────────────────────────────────────────
export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
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
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: UserAddress;
  paymentMethod: string;
  paymentStatus: string;
  note?: string;
  estimatedDelivery?: string;
  createdAt: number;
  updatedAt: number;
}

// ─── Navigation Types ────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
}

// ─── Offer Types ─────────────────────────────────────────────
export interface Offer {
  _id: string;
  title: string;
  description: string;
  code?: string;
  discountPercent: number;
  discountAmount?: number;
  minOrder?: number;
  validUntil: number;
  isActive: boolean;
  image?: string;
}

// ─── FAQ Types ───────────────────────────────────────────────
export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}
