import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: { status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("hidden"))), productId: v.optional(v.id("products")) },
  handler: async (ctx, args) => {
    let reviews = await ctx.db.query("reviews").collect();
    if (args.status) reviews = reviews.filter(r => r.status === args.status);
    if (args.productId) reviews = reviews.filter(r => r.productId === args.productId);
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const moderate = mutation({
  args: {
    id: v.id("reviews"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("hidden")),
    isPinned: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(id, { ...fields, moderatedBy: user?._id, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("reviews").collect();
    return {
      total: all.length,
      pending: all.filter(r => r.status === "pending").length,
      approved: all.filter(r => r.status === "approved").length,
      rejected: all.filter(r => r.status === "rejected").length,
    };
  },
});
