// MB Crunchy — Product Types & Helpers (Zero Static Data)
// All data comes from Convex. This file only provides TypeScript types and utility helpers.

import type { Doc } from "@/convex/_generated/dataModel";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "kitchen" | "mart";
  subcategory: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount: number;
  weight: string;
  weightValue?: number;
  weightUnit?: string;
  rating: number;
  reviewCount: number;
  veg: boolean;
  inStock: boolean;
  image: string;
  images?: string[];
  gallery?: string[];
  ingredients?: string;
  nutrition?: string;
  allergens?: string;
  storageInstructions?: string;
  shelfLife?: string;
  spicyLevel?: string;
  preparationTime?: number;
  servingSize?: string;
  isCombo?: boolean;
  isPartyPack?: boolean;
  comboItems?: string[];
  partyPackServes?: number;
  partyPackItems?: string[];
  savings?: number;
  tags?: string[];
  businessType?: string;
  categoryId?: string;
}

export type SortOption = "default" | "price-low" | "price-high" | "rating" | "newest" | "discount" | "name";

// Map a Convex product document to the display Product type
export function mapConvexProduct(doc: any, reviewCount: number = 0): Product {
  const originalPrice = doc.mrp ?? doc.price;
  const discount = doc.discount ?? (doc.mrp && doc.mrp > doc.price ? Math.round((1 - doc.price / doc.mrp) * 100) : 0);
  const weightStr = doc.weightValue ? `${doc.weightValue}${doc.weightUnit || "g"}` : "";
  const tags: string[] = [];
  if (doc.isBestSeller) tags.push("bestseller");
  if (doc.isFeatured) tags.push("featured");
  if (doc.isTrending) tags.push("trending");
  if (doc.isNewArrival) tags.push("new");
  if (doc.isRecommended) tags.push("recommended");
  if (doc.spicyLevel && doc.spicyLevel !== "mild") tags.push(doc.spicyLevel === "hot" || doc.spicyLevel === "extra-hot" ? "spicy" : doc.spicyLevel);

  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug || doc.name.toLowerCase().replace(/\s+/g, "-"),
    category: doc.businessType || "kitchen",
    subcategory: doc.categoryId || "",
    description: doc.description || `${doc.name} — fresh and delicious!`,
    shortDescription: doc.shortDescription,
    price: doc.price,
    originalPrice: originalPrice > doc.price ? originalPrice : undefined,
    discount,
    weight: weightStr,
    weightValue: doc.weightValue,
    weightUnit: doc.weightUnit,
    rating: 4.5,
    reviewCount,
    veg: doc.veg ?? true,
    inStock: doc.inStock ?? (doc.stock ?? 0) > 0,
    image: doc.images?.[0] || "📦",
    images: doc.images,
    gallery: doc.gallery,
    ingredients: doc.ingredients,
    nutrition: doc.nutrition,
    allergens: doc.allergens,
    storageInstructions: doc.storageInstructions,
    shelfLife: doc.shelfLife,
    spicyLevel: doc.spicyLevel,
    preparationTime: doc.preparationTime,
    servingSize: doc.servingSize,
    tags: tags.length > 0 ? tags : undefined,
    businessType: doc.businessType,
    categoryId: doc.categoryId,
  };
}

// Map a Convex combo document to the display Product type
export function mapConvexCombo(doc: any, productNames: string[] = []): Product {
  return {
    id: doc._id,
    name: doc.name,
    slug: doc.name.toLowerCase().replace(/\s+/g, "-"),
    category: doc.businessType || "kitchen",
    subcategory: "Combos",
    description: doc.description || "",
    price: doc.comboPrice,
    originalPrice: doc.mrp > doc.comboPrice ? doc.mrp : undefined,
    discount: doc.mrp > doc.comboPrice ? Math.round((1 - doc.comboPrice / doc.mrp) * 100) : 0,
    weight: doc.weight || "",
    rating: 4.5,
    reviewCount: 0,
    veg: true,
    inStock: true,
    image: doc.image || "🎁",
    isCombo: true,
    comboItems: productNames.length > 0 ? productNames : undefined,
    savings: doc.savings,
    businessType: doc.businessType,
  };
}

// Map a Convex party pack document to the display Product type
export function mapConvexPartyPack(doc: any, productNames: string[] = []): Product {
  return {
    id: doc._id,
    name: doc.name,
    slug: doc.name.toLowerCase().replace(/\s+/g, "-"),
    category: doc.businessType || "kitchen",
    subcategory: "Party Packs",
    description: doc.description || "",
    price: doc.partyPrice,
    originalPrice: doc.mrp > doc.partyPrice ? doc.mrp : undefined,
    discount: doc.mrp > doc.partyPrice ? Math.round((1 - doc.partyPrice / doc.mrp) * 100) : 0,
    weight: doc.weight || "",
    rating: 4.5,
    reviewCount: 0,
    veg: true,
    inStock: true,
    image: doc.image || "🎉",
    isPartyPack: true,
    partyPackServes: doc.serves,
    partyPackItems: productNames.length > 0 ? productNames : undefined,
    savings: doc.savings,
    businessType: doc.businessType,
  };
}

// Filter helpers (same logic, no static data dependency)
export function filterProducts(products: Product[], filters: { veg?: boolean; nonVeg?: boolean; search?: string }): Product[] {
  return products.filter((p) => {
    if (filters.veg && !filters.nonVeg && !p.veg) return false;
    if (filters.nonVeg && !filters.veg && p.veg) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-low": return sorted.sort((a, b) => a.price - b.price);
    case "price-high": return sorted.sort((a, b) => b.price - a.price);
    case "rating": return sorted.sort((a, b) => b.rating - a.rating);
    case "discount": return sorted.sort((a, b) => b.discount - a.discount);
    case "name": return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default: return sorted;
  }
}
