import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Business Settings ───
export const getBusiness = query({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db.query("businesses").collect();
    return businesses[0] ?? null;
  },
});

export const updateBusiness = mutation({
  args: {
    name: v.optional(v.string()),
    tagline: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    pincode: v.optional(v.string()),
    gst: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const businesses = await ctx.db.query("businesses").collect();
    if (businesses[0]) await ctx.db.patch(businesses[0]._id, { ...args, updatedAt: Date.now() });
    else await ctx.db.insert("businesses", { ...args, name: args.name ?? "MB Crunchy", tagline: args.tagline ?? "Fresh • Homemade • Premium", updatedAt: Date.now() } as any);
  },
});

// ─── Branding ───
export const getBranding = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("brandingSettings").collect();
    return settings[0] ?? null;
  },
});

export const updateBranding = mutation({
  args: {
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    storeName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    aboutText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("brandingSettings").collect();
    if (existing[0]) await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
    else await ctx.db.insert("brandingSettings", { ...args, updatedAt: Date.now() });
  },
});

// ─── Delivery Charges ───
export const listDeliveryCharges = query({
  args: {},
  handler: async (ctx) => {
    const charges = await ctx.db.query("deliveryCharges").collect();
    return charges.filter(c => c.isActive);
  },
});

export const updateDeliveryCharges = mutation({
  args: {
    id: v.optional(v.id("deliveryCharges")),
    charge: v.number(),
    minOrderFree: v.optional(v.number()),
    estimatedMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.query("deliveryCharges").collect();
    if (id) await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
    else if (existing[0]) await ctx.db.patch(existing[0]._id, { ...fields, updatedAt: Date.now() });
    else await ctx.db.insert("deliveryCharges", { ...fields, isActive: true, updatedAt: Date.now() });
  },
});

// ─── Payment Settings ───
export const getPaymentSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("paymentSettings").collect();
    return settings[0] ?? null;
  },
});

export const updatePaymentSettings = mutation({
  args: {
    upiId: v.optional(v.string()),
    cashEnabled: v.optional(v.boolean()),
    upiEnabled: v.optional(v.boolean()),
    whatsappConfirmation: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("paymentSettings").collect();
    if (existing[0]) await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
    else await ctx.db.insert("paymentSettings", { ...args, cashEnabled: true, upiEnabled: true, whatsappConfirmation: true, updatedAt: Date.now() });
  },
});

// ─── Business Hours ───
export const listBusinessHours = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businessHours").collect();
  },
});

export const updateBusinessHours = mutation({
  args: {
    hours: v.array(v.object({
      day: v.union(v.literal("monday"), v.literal("tuesday"), v.literal("wednesday"), v.literal("thursday"), v.literal("friday"), v.literal("saturday"), v.literal("sunday")),
      open: v.optional(v.string()),
      close: v.optional(v.string()),
      isOpen: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("businessHours").collect();
    for (const h of existing) await ctx.db.delete(h._id);
    for (const h of args.hours) await ctx.db.insert("businessHours", h);
  },
});

// ─── Dashboard Stats ───
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();
    const customers = await ctx.db.query("users").collect();
    const reviews = await ctx.db.query("reviews").collect();
    const coupons = await ctx.db.query("coupons").collect();
    const lowStock = await ctx.db.query("inventory").collect().then(all => all.filter(i => i.quantity <= (i.lowStockLimit ?? 5)));

    const revenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const pendingReviews = reviews.filter(r => r.status === "pending").length;
    const activeCoupons = coupons.filter(c => c.isActive).length;

    return {
      totalOrders: orders.length,
      totalRevenue: revenue,
      totalProducts: products.length,
      totalCustomers: customers.length,
      pendingOrders,
      pendingReviews,
      activeCoupons,
      lowStockCount: lowStock.length,
      recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    };
  },
});
