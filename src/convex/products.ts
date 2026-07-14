import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// ─── Queries ───

export const list = query({
  args: {
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"))),
    categoryId: v.optional(v.id("categories")),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("draft"))),
    search: v.optional(v.string()),
    veg: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();
    
    if (args.businessType) products = products.filter(p => p.businessType === args.businessType);
    if (args.categoryId) products = products.filter(p => p.categoryId === args.categoryId);
    if (args.status) products = products.filter(p => p.status === args.status);
    if (args.veg !== undefined) products = products.filter(p => p.veg === args.veg);
    if (args.search) {
      const q = args.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    
    return products.sort((a, b) => b.createdAt - a.createdAt).slice(0, args.limit ?? 100);
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").withIndex("slug", q => q.eq("slug", args.slug)).collect();
    return products[0] ?? null;
  },
});

// ─── Mutations ───

export const create = mutation({
  args: {
    businessType: v.union(v.literal("kitchen"), v.literal("mart")),
    categoryId: v.id("categories"),
    subcategoryId: v.optional(v.id("categories")),
    brandId: v.optional(v.id("brands")),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    gallery: v.optional(v.array(v.string())),
    price: v.number(),
    mrp: v.optional(v.number()),
    discount: v.optional(v.number()),
    weightValue: v.optional(v.number()),
    weightUnit: v.optional(v.string()),
    veg: v.boolean(),
    stock: v.optional(v.number()),
    lowStockLimit: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("draft")),
    tags: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    isRecommended: v.optional(v.boolean()),
    preparationTime: v.optional(v.number()),
    servingSize: v.optional(v.string()),
    sku: v.optional(v.string()),
    nutrition: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    allergens: v.optional(v.string()),
    storageInstructions: v.optional(v.string()),
    shelfLife: v.optional(v.string()),
    spicyLevel: v.optional(v.union(v.literal("mild"), v.literal("medium"), v.literal("hot"), v.literal("extra-hot"))),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    const id = await ctx.db.insert("products", {
      ...args,
      inStock: (args.stock ?? 0) > 0,
      createdBy: user?._id,
      updatedBy: user?._id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"))),
    categoryId: v.optional(v.id("categories")),
    subcategoryId: v.optional(v.id("categories")),
    brandId: v.optional(v.id("brands")),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    gallery: v.optional(v.array(v.string())),
    price: v.optional(v.number()),
    mrp: v.optional(v.number()),
    discount: v.optional(v.number()),
    weightValue: v.optional(v.number()),
    weightUnit: v.optional(v.string()),
    veg: v.optional(v.boolean()),
    stock: v.optional(v.number()),
    lowStockLimit: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("draft"))),
    tags: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    isRecommended: v.optional(v.boolean()),
    preparationTime: v.optional(v.number()),
    servingSize: v.optional(v.string()),
    sku: v.optional(v.string()),
    nutrition: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    allergens: v.optional(v.string()),
    storageInstructions: v.optional(v.string()),
    shelfLife: v.optional(v.string()),
    spicyLevel: v.optional(v.union(v.literal("mild"), v.literal("medium"), v.literal("hot"), v.literal("extra-hot"))),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const user = await getCurrentUser(ctx);
    const patch: any = { ...fields, updatedBy: user?._id, updatedAt: Date.now() };
    if (fields.stock !== undefined) patch.inStock = fields.stock > 0;
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    ids: v.array(v.id("products")),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("draft")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const id of args.ids) {
      await ctx.db.patch(id, { status: args.status, updatedAt: now });
    }
  },
});

export const duplicate = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.id);
    if (!original) throw new Error("Product not found");
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    const { _id, _creationTime, ...productData } = original;
    return await ctx.db.insert("products", {
      ...productData,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${now}`,
      sku: original.sku ? `${original.sku}-COPY` : undefined,
      createdBy: user?._id,
      updatedBy: user?._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});
