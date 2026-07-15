import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { search: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let customers = await ctx.db.query("users").collect();
    if (args.search) {
      const q = args.search.toLowerCase();
      customers = customers.filter(c => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q));
    }
    return customers.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0)).slice(0, args.limit ?? 50);
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const getOrderHistory = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").withIndex("customer", q => q.eq("customerId", args.customerId)).collect();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const updateNotes = mutation({
  args: { id: v.id("us

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 1,126 characters. Read it separately or use code_search for the relevant section.