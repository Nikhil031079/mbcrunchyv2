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
    const existing = await ctx.db.query("inventory").withIndex("product", q => q.eq("productId", args.productId)).collect();
    const inv = existing[0];
    const previousStock = inv?.quantity ?? 0;
    let newStock: number;
    if (args.changeType === "addition") newStock = previousStock + args.quantity;
    else if (args.changeType === "deduction") newStock = Math.max(0, previousStock - args.quantity);
    else newStock = args.quantity;

    if (inv) {
      await ctx.db.patch(inv._id, { quantity: newStock, lastRestockedAt: args.changeType === "addition" ? Date.now() : undefined });
    } else {
      await ctx.db.insert("inventory", { productId: args.productId, quantity: newStock, lowStockLimit: 5 });
    }

    await ctx.db.insert("stockHistory", {
      productId: args.productId,
      changeType: args.changeType,
      quantity: args.quantity,
      previousStock,
      newStock,
      note: args.note,
      changedBy: user?._id,
      createdAt: Date.now(),
    });

    // Update product stock
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, { stock: newStock, inStock: newStock > 0, updatedAt: Date.now() });
    }
  },
});

export const getStockHistory = query({
  args: { productId: v.id("products"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const history = await ctx.db.query("stockHistory").withIndex("product", q => q.eq("productId", args.productId)).collect();
    return history.sort((a, b) => b.createdAt - a.createdAt).slice(0, args.limit ?? 20);
  },
});
