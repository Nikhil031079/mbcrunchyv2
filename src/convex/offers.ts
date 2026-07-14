// MB Crunchy — Offers & Promotions Backend
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("flash-sale"), v.literal("festival"), v.literal("category"), v.literal("product"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let offers = await ctx.db.query("offers").collect();
    if (args.type) offers = offers.filter(o => o.type === args.type);
    if (args.isActive !== undefined) offers = offers.filter(o => o.isActive === args.isActive);
    return offers.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("flash-sale"), v.literal("festival"), v.literal("category"), v.literal("product")),
    discountPercent: v.optional(v.number()),
    discountFlat: v.optional(v.number()),
    minOrder: v.optional(v.number()),
    code: v.optional(v.string()),
    image: v.optional(v.string()),
    validFrom: v.number(),
    validUntil: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("offers", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("offers"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("flash-sale"), v.literal("festival"), v.literal("category"), v.literal("product"))),
    discountPercent: v.optional(v.number()),
    discountFlat: v.optional(v.number()),
    minOrder: v.optional(v.number()),
    code: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("offers") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});
