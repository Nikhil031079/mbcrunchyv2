// MB Crunchy — Enhanced Dynamic Business Settings
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
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const businesses = await ctx.db.query("businesses").collect();
    if (businesses[0]) await ctx.db.patch(businesses[0]._id, { ...args, updatedAt: Date.now() });
    else await ctx.db.insert("businesses", {
      ...args,
      name: args.name ?? "MB Crunchy",
      tagline: args.tagline ?? "Fresh \u2022 Homemade \u2022 Premium",
      updatedAt: Date.now(),
    });
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
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
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
    upiQrImage: v.optional(v.string()),
    accountHolder: v.optional(v.string()),
    bankName: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    ifscCode: v.optional(v.string()),
    cashEnabled: v.optional(v.boolean()),
    upiEnabled: v.optional(v.boolean()),
    whatsappConfirmation: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("paymentSettings").collect();
    if (existing[0]) await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
    else await ctx.db.insert("paymentSettings", {
      ...args,
      cashEnabled: true,
      upiEnabled: true,
      whatsappConfirmation: true,
      updatedAt: Date.now(),
    });
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

// ─── System Settings ───
export const getSystemSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("systemSettings").collect();
    return settings[0] ?? null;
  },
});

export const updateSystemSettings = mutation({
  args: {
    currency: v.optional(v.string()),
    currencySymbol: v.optional(v.string()),
    timezone: v.optional(v.string()),
    orderPrefix: v.optional(v.string()),
    invoicePrefix: v.optional(v.string()),
    maintenanceMode: v.optional(v.boolean()),
    packagingCharge: v.optional(v.number()),
    gstPercent: v.optional(v.number()),
    taxPercent: v.optional(v.number()),
    deliveryRadius: v.optional(v.number()),
    minOrderValue: v.optional(v.number()),
    freeDeliveryThreshold: v.optional(v.number()),
    estimatedPrepMinutes: v.optional(v.number()),
    estimatedDeliveryMinutes: v.optional(v.number()),
    customFooter: v.optional(v.string()),
    socialMediaInstagram: v.optional(v.string()),
    socialMediaFacebook: v.optional(v.string()),
    socialMediaYoutube: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("systemSettings").collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
    } else {
      const defaults = {
        currency: "INR",
        currencySymbol: "\u20B9",
        timezone: "Asia/Kolkata",
        orderPrefix: "MB",
        invoicePrefix: "INV",
        maintenanceMode: false,
        packagingCharge: 10,
        gstPercent: 5,
        taxPercent: 0,
        deliveryRadius: 10,
        minOrderValue: 0,
        freeDeliveryThreshold: 199,
        estimatedPrepMinutes: 20,
        estimatedDeliveryMinutes: 30,
        updatedAt: Date.now(),
      };
      await ctx.db.insert("systemSettings", { ...defaults, ...args, updatedAt: Date.now() });
    }
  },
});

// ─── SEO Settings ───
export const getSeoSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("seoSettings").collect();
    return settings[0] ?? null;
  },
});

export const updateSeoSettings = mutation({
  args: {
    defaultTitle: v.optional(v.string()),
    defaultDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    googleAnalyticsId: v.optional(v.string()),
    metaKeywords: v.optional(v.string()),
    robotsTxt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("seoSettings").collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("seoSettings", {
        ...args,
        defaultTitle: "MB Crunchy \u2014 Fresh \u2022 Homemade \u2022 Premium",
        defaultDescription: "Your destination for premium frozen foods, homemade snacks, cold-pressed oils, natural honey, and organic products. Freshness delivered to your doorstep.",
        updatedAt: Date.now(),
      });
    }
  },
});

// ─── Combined App Settings ───
export const getAllAppSettings = query({
  args: {},
  handler: async (ctx) => {
    const [business, branding, payments, deliveryCharges, hours, system, seo] = await Promise.all([
      ctx.db.query("businesses").collect().then(r => r[0] ?? null),
      ctx.db.query("brandingSettings").collect().then(r => r[0] ?? null),
      ctx.db.query("paymentSettings").collect().then(r => r[0] ?? null),
      ctx.db.query("deliveryCharges").collect().then(r => r.filter(c => c.isActive)),
      ctx.db.query("businessHours").collect(),
      ctx.db.query("systemSettings").collect().then(r => r[0] ?? null),
      ctx.db.query("seoSettings").collect().then(r => r[0] ?? null),
    ]);

    return {
      business,
      branding,
      payments,
      deliveryCharges,
      businessHours: hours,
      system: system ?? {
        currency: "INR",
        currencySymbol: "\u20B9",
        timezone: "Asia/Kolkata",
        orderPrefix: "MB",
        invoicePrefix: "INV",
        maintenanceMode: false,
        packagingCharge: 10,
        gstPercent: 5,
        taxPercent: 0,
        deliveryRadius: 10,
        minOrderValue: 0,
        freeDeliveryThreshold: 199,
        estimatedPrepMinutes: 20,
        estimatedDeliveryMinutes: 30,
        updatedAt: Date.now(),
      },
      seo: seo ?? {
        defaultTitle: "MB Crunchy \u2014 Fresh \u2022 Homemade \u2022 Premium",
        defaultDescription: "Your destination for premium frozen foods, homemade snacks, cold-pressed oils, natural honey, and organic products.",
        updatedAt: Date.now(),
      },
    };
  },
});

// ─── Dashboard Stats ───
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();
    const customers = await ctx.db.query("users").collect();
    const reviews = await ctx.db.query("reviews").collect();
    const coupons = await ctx.db.query("coupons").collect();
    const inventory = await ctx.db.query("inventory").collect();
    const lowStock = inventory.filter(i => i.quantity <= (i.lowStockLimit ?? 5));

    const revenue = allOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = allOrders.filter(o => o.createdAt >= todayStart.getTime());
    const weekStart = todayStart.getTime() - 7 * 24 * 60 * 60 * 1000;
    const weekOrders = allOrders.filter(o => o.createdAt >= weekStart);
    const weekRevenue = weekOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

    return {
      totalOrders: allOrders.length,
      totalRevenue: revenue,
      totalProducts: products.length,
      totalCustomers: customers.length,
      pendingOrders: allOrders.filter(o => o.status === "pending").length,
      preparingOrders: allOrders.filter(o => o.status === "preparing").length,
      todaysOrders: todayOrders.length,
      todaysRevenue: todayOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
      weekRevenue,
      weekOrders: weekOrders.length,
      pendingReviews: reviews.filter(r => r.status === "pending").length,
      activeCoupons: coupons.filter(c => c.isActive).length,
      lowStockCount: lowStock.length,
      recentOrders: allOrders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    };
  },
});

// ─── Backup: Export all data ───
export const exportAllData = query({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "businesses", "brandingSettings", "paymentSettings", "deliveryCharges",
      "businessHours", "systemSettings", "seoSettings",
      "categories", "brands", "products", "combos", "partyPacks",
      "orders", "orderItems", "coupons", "offers",
      "reviews", "inventory", "stockHistory",
      "faqs", "blogs", "banners", "testimonials",
      "contactMessages", "newsletterSubscribers",
      "notifications", "auditLogs",
    ] as const;

    const data: Record<string, unknown[]> = {};
    for (const table of tables) {
      data[table] = await ctx.db.query(table).collect();
    }
    return data;
  },
});

// ─── Backup: Log backup event ───
export const logBackup = mutation({
  args: {
    fileName: v.string(),
    totalTables: v.number(),
    totalRecords: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("backupHistory", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ─── Backup: List backup history ───
export const listBackupHistory = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("backupHistory").order("desc").collect();
  },
});
