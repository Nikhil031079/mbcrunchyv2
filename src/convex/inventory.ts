import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("inventory").withIndex("product", q => q.eq("productId", args.productId)).collect();
    return items[0] ?? null;
  },
});

export const getLowStock = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("inventory").collect();
    return all.filter(i => i.quantity <= (i.lowStockLimit ?? 5)).sort((a, b) => a.quantity - b.quantity);
  },
});

export const adjustStock = mutation({
  args: {
    productId: v.id("products"),
    changeType: v.union(v.literal("addition"), v.literal("deduction"), v.literal("adjustment")),
    quantity: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const existing

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 994 characters. Read it separately or use code_search for the relevant section.