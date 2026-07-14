import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("accepted"), v.literal("preparing"), v.literal("ready"), v.literal("out-for-delivery"), v.literal("completed"), v.literal("cancelled"))),
    customerId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("orders").order("desc").collect();
    if (args.status) orders = orders.filter(o => o.status === args.status);
    if (args.customerId) orders = orders.filter(o => o.customerId === args.customerId);
    return orders.slice(0, args.limit ?? 50);
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").withIndex("orderNumber", q => q.eq("orderNumber", args.orderNumber)).collect();
    return orders[0] ?? null;
  },
});

export const create = mutation({
  args: {
    customerId: v.id("users"),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.optional(v.string()),
      weight: v.optional(v.string()),
      veg: v.optional(v.boolean()),
    })),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    paymentMethod: v.union(v.literal("cash"), v.literal("upi"), v.literal("pending")),
    orderType: v.union(v.literal("delivery"), v.literal("takeaway")),
    deliveryAddress: v.optional(v.string()),
    deliveryCity: v.optional(v.string()),
    deliveryPincode: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const orderNumber = `MB-${now.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const orderId = await ctx.db.insert("orders", {
      ...args,
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
      discount: 0,
      createdAt: now,
      updatedAt: now,
    });
    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
        veg: item.veg,
      });
    }
    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("preparing"), v.literal("ready"), v.literal("out-for-delivery"), v.literal("completed"), v.literal("cancelled")),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const timestamps: any = { updatedAt: now };
    const statusMap: Record<string, string> = {
      accepted: "acceptedAt", preparing: "preparingAt", ready: "readyAt",
      "out-for-delivery": "outForDeliveryAt", completed: "completedAt", cancelled: "cancelledAt",
    };
    const field = statusMap[args.status];
    if (field) timestamps[field] = now;
    if (args.status === "cancelled" && args.cancellationReason) timestamps.cancellationReason = args.cancellationReason;
    await ctx.db.patch(args.id, { status: args.status, ...timestamps });
  },
});

export const getRecentOrders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    return orders.slice(0, args.limit ?? 10);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      completed: orders.filter(o => o.status === "completed").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    };
  },
});
