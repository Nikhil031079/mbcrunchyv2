import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const list = query({
  args: {
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both"))),
    parentId: v.optional(v.id("categories")),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    let categories = await ctx.db.query("categories").collect();
    if (args.businessType) categories = categories.filter(c => c.businessType === args.businessType || c.businessType === "both");
    if (args.parentId !== undefined) categories = categories.filter(c => c.parentId === args.parentId);
    else categories = categories.filter(c => !c.parentId);
    if (args.status) categories = categories.filter(c => c.status === args.status);
    return categories.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  },
});

export const getTree = query({
  args: { businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both"))) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("categories").collect();
    let filtered = all;
    if (args.businessType) filtered = filtered.filter(c => c.businessType === args.businessType || c.businessType === "both");
    const buildTree = (parentId: string | undefined): any[] =>
      filtered.filter(c => c.parentId === parentId).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)).map(c => ({ ...c, children: buildTree(c._id) }));
    return buildTree(undefined);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
    parentId: v.optional(v.id("categories")),
    icon: v.optional(v.string()),
    banner: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    return await ctx.db.insert("categories", { ...args, createdBy: user?._id, updatedBy: user?._id, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    businessType: v.optional(v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both"))),
    parentId: v.optional(v.id("categories")),
    icon: v.optional(v.string()),
    banner: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(id, { ...fields, updatedBy: user?._id, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const children = await ctx.db.query("categories").withIndex("parent", q => q.eq("parentId", args.id)).collect();
    for (const child of children) await ctx.db.delete(child._id);
    await ctx.db.delete(args.id);
  },
});
