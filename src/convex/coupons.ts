import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: { isActive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let coupons = await ctx.db.query("coupons").collect();
    if (args.isActive !== undefined) coupons = coupons.filter(c => c.isActive === args.isActive);
    return coupons.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("flat")),
    value: v.number(),
    minOrder: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
    validFrom: v.number(),
    validUntil: v.number(),
    isActive: v.boolean(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return await ctx.db.insert("coupons", { ...args, usedCount: 0, createdBy: user?._id, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("coupons"),
    code: v.optional(v.string()),
    type: v.optional(v.union(v.literal("percentage"), v.literal("flat"))),
    value: v.optional(v.number()),
    minOrder: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

export const validate = query({
  args: { code: v.string(), subtotal: v.number() },
  handler: async (ctx, args) => {
    const coupons = await ctx.db.query("coupons").withIndex("code", q => q.eq("code", args.code.toUpperCase())).collect();
    const coupon = coupons[0];
    if (!coupon || !coupon.isActive) return { valid: false, reason: "Coupon not found or inactive" };
    if (Date.now() < coupon.validFrom || Date.now() > coupon.validUntil) return { valid: false, reason: "Coupon expired" };
    if (coupon.minOrder && args.subtotal < coupon.minOrder) return { valid: false, reason: `Minimum order ₹${coupon.minOrder}` };
    if (coupon.usageLimit && (coupon.usedCount ?? 

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 2,555 characters. Read it separately or use code_search for the relevant section.