import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const listCombos = query({
  args: { businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"))) },
  handler: async (ctx, args) => {
    let combos = await ctx.db.query("combos").collect();
    if (args.businessType) combos = combos.filter(c => c.businessType === args.businessType);
    return combos.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createCombo = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    businessType: v.union(v.literal("kitchen"), v.literal("mart")),
    productIds: v.array(v.id("products")),
    comboPrice: v.number(),
    mrp: v.number(),
    savings: v.number(),
    image: v.optional(v.string()),
    weight: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return await ctx.db.insert("combos", { ...args, createdBy: user?._id, updatedBy: user?._id, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updateCombo = mutation({
  args: {
    id: v.id("combos"),
    nam

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 1,260 characters. Read it separately or use code_search for the relevant section.