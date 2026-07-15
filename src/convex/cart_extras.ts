// MB Crunchy — Cart Extras: Add-ons, Upsell Rules, Cross-Sell Rules
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══════════════════════════════════════════
// ADD-ONS
// ═══════════════════════════════════════════

export const listAddOns = query({
  args: {
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both"))),
    category: v.optional(v.string()),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("addOns" as any).collect();
    if (args.businessType) items = (items as any[]).filter((a: any) => a.businessType === args.businessType || a.businessType === "both");
    if (args.category) items = (items as any[]).filter((a: any) => a.category === args.category);
    if (args.activeOnly) items = (items as any[]).filter((a: any) => a.isActive);
    return items.sort((a: any, b: any) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  },
});

export const listAddOnCategories = query({
  args: {
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both"))),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("addOns" as any).collect();
    if (args.businessType) items = (items as any[]).filter((a: any) => a.businessType === args.businessType || a.businessType === "both");
    items = (items as any[]).filter((a: any) => a.isActive);
    const categories = [...new Set((items as any[]).map((a: any) => a.category || "other"))];
    return categories;
  },
});

export const createAddOn = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    image: v.optional(v.string()),
    businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
    category: v.optional(v.union(v.literal("cold-drinks"), v.literal("desserts"), v.literal("sauces"), v.literal("ice-cream"), v.literal("party-packs"), v.literal("kitchen-specials"), v.literal("other"))),
    maxQuantity: v.optional(v.number()),
    sortOrder: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("addOns" as any, {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any);
  },
});

export const updateAddOn = mutation({
  args: {
    id: v.id("addOns"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both"))),
    category: v.optional(v.union(v.literal("cold-drinks"), v.literal("desserts"), v.literal("sauces"), v.literal("ice-cream"), v.literal("party-packs"), v.literal("kitchen-specials"), v.literal("other"))),
    maxQuantity: v.optional(v.number()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id as any, { ...fields, updatedAt: Date.now() } as any);
  },
});

export const removeAddOn = mutation({
  args: { id: v.id("addOns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id as any);
  },
});

// ═══════════════════════════════════════════
// UPSELL RULES
// ═══════════════════════════════════════════

export const listUpsellRules = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let rules = await ctx.db.query("upsellRules" as any).collect();
    if (args.activeOnly) rules = (rules as any[]).filter((r: any) => r.isActive);
    return rules.sort((a: any, b: any) => (a.priority ?? 999) - (b.priority ?? 999));
  },
});

export const getUpsellForProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const rules = await ctx.db.query("upsellRules" as any).collect();
    const match = (rules as any[]).find((r: any) => r.triggerProductId === args.productId && r.isActive);
    if (!match) return null;
    const products = await Promise.all(
      (match.targetProductIds as string[]).map(async (id: any) => ctx.db.get(id))
    );
    return { ...match, targetProducts: products.filter(Boolean) };
  },
});

export const createUpsellRule = mutation({
  args: {
    triggerProductId: v.id("products"),
    targetComboId: v.optional(v.id("combos")),
    targetProductIds: v.array(v.id("products")),
    title: v.string(),
    description: v.optional(v.string()),
    offerPrice: v.number(),
    originalPrice: v.number(),
    savings: v.number(),
    isActive: v.boolean(),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("upsellRules" as any, {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any);
  },
});

export const updateUpsellRule = mutation({
  args: {
    id: v.id("upsellRules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    offerPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    savings: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id as any, { ...fields, updatedAt: Date.now() } as any);
  },
});

export const removeUpsellRule = mutation({
  args: { id: v.id("upsellRules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id as any);
  },
});

// ═══════════════════════════════════════════
// CROSS-SELL RULES
// ═══════════════════════════════════════════

export const listCrossSellRules = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let rules = await ctx.db.query("crossSellRules" as any).collect();
    if (args.activeOnly) rules = (rules as any[]).filter((r: any) => r.isActive);
    return rules.sort((a: any, b: any) => b.createdAt - a.createdAt);
  },
});

export const getCrossSellForProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const rules = await ctx.db.query("crossSellRules" as any).collect();
    const matches = (rules as any[]).filter((r: any) => r.productId === args.productId && r.isActive);
    const allProducts: any[] = [];
    for (const match of matches) {
      const products = await Promise.all(
        (match.suggestedProductIds as string[]).map(async (id: any) => ctx.db.get(id))
      );
      allProducts.push(...products.filter(Boolean));
    }
    return allProducts.slice(0, 6);
  },
});

export const createCrossSellRule = mutation({
  args: {
    productId: v.id("products"),
    suggestedProductIds: v.array(v.id("products")),
    ruleType: v.union(v.literal("category"), v.literal("tag"), v.literal("manual"), v.literal("frequently-bought")),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("crossSellRules" as any, {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any);
  },
});

export const removeCrossSellRule = mutation({
  args: { id: v.id("crossSellRules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id as any);
  },
});
