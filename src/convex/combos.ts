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
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    productIds: v.optional(v.array(v.id("products"))),
    comboPrice: v.optional(v.number()),
    mrp: v.optional(v.number()),
    savings: v.optional(v.number()),
    weight: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(id, { ...fields, updatedBy: user?._id, updatedAt: Date.now() });
  },
});

export const removeCombo = mutation({
  args: { id: v.id("combos") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

// Party Packs
export const listPartyPacks = query({
  args: { businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"))) },
  handler: async (ctx, args) => {
    let packs = await ctx.db.query("partyPacks").collect();
    if (args.businessType) packs = packs.filter(p => p.businessType === args.businessType);
    return packs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createPartyPack = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    businessType: v.union(v.literal("kitchen"), v.literal("mart")),
    productIds: v.array(v.id("products")),
    partyPrice: v.number(),
    mrp: v.number(),
    savings: v.number(),
    serves: v.number(),
    weight: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return await ctx.db.insert("partyPacks", { ...args, createdBy: user?._id, updatedBy: user?._id, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updatePartyPack = mutation({
  args: {
    id: v.id("partyPacks"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    productIds: v.optional(v.array(v.id("products"))),
    partyPrice: v.optional(v.number()),
    mrp: v.optional(v.number()),
    savings: v.optional(v.number()),
    serves: v.optional(v.number()),
    weight: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(id, { ...fields, updatedBy: user?._id, updatedAt: Date.now() });
  },
});

export const removePartyPack = mutation({
  args: { id: v.id("partyPacks") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});
