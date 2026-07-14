import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    ...authTables,

    // ─── Users ───
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(v.union(v.literal("admin"), v.literal("manager"), v.literal("customer"))),
      phone: v.optional(v.string()),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      pincode: v.optional(v.string()),
      totalOrders: v.optional(v.number()),
      totalSpent: v.optional(v.number()),
      notes: v.optional(v.string()),
      status: v.optional(v.union(v.literal("active"), v.literal("blocked"))),
      lastLoginAt: v.optional(v.number()),
    })
      .index("email", ["email"])
      .index("phone", ["phone"]),

    // ─── Business Settings ───
    businesses: defineTable({
      name: v.string(),
      tagline: v.string(),
      logo: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      pincode: v.optional(v.string()),
      gst: v.optional(v.string()),
      updatedAt: v.number(),
    }),

    // ─── Categories ───
    categories: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
      parentId: v.optional(v.id("categories")),
      image: v.optional(v.string()),
      icon: v.optional(v.string()),
      banner: v.optional(v.string()),
      sortOrder: v.optional(v.number()),
      status: v.union(v.literal("active"), v.literal("inactive")),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("parent", ["parentId"])
      .index("businessType", ["businessType"]),

    // ─── Brands ───
    brands: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      status: v.union(v.literal("active"), v.literal("inactive")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("slug", ["slug"]),

    // ─── Products ───
    products: defineTable({
      businessType: v.union(v.literal("kitchen"), v.literal("mart")),
      categoryId: v.id("categories"),
      subcategoryId: v.optional(v.id("categories")),
      brandId: v.optional(v.id("brands")),
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      shortDescription: v.optional(v.string()),
      images: v.optional(v.array(v.string())),
      gallery: v.optional(v.array(v.string())),
      weightValue: v.optional(v.number()),
      weightUnit: v.optional(v.string()),
      price: v.number(),
      mrp: v.optional(v.number()),
      discount: v.optional(v.number()),
      sku: v.optional(v.string()),
      barcode: v.optional(v.string()),
      stock: v.optional(v.number()),
      lowStockLimit: v.optional(v.number()),
      preparationTime: v.optional(v.number()),
      servingSize: v.optional(v.string()),
      veg: v.boolean(),
      isBestSeller: v.optional(v.boolean()),
      isFeatured: v.optional(v.boolean()),
      isNewArrival: v.optional(v.boolean()),
      isTrending: v.optional(v.boolean()),
      inStock: v.optional(v.boolean()),
      status: v.union(v.literal("active"), v.literal("inactive"), v.literal("draft")),
      tags: v.optional(v.array(v.string())),
      nutrition: v.optional(v.string()),
      ingredients: v.optional(v.string()),
      allergens: v.optional(v.string()),
      sortOrder: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("category", ["categoryId"])
      .index("businessType", ["businessType"])
      .index("status", ["status"])
      .index("sku", ["sku"]),

    // ─── Combos ───
    combos: defineTable({
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
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("status", ["status"]),

    // ─── Party Packs ───
    partyPacks: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      businessType: v.union(v.literal("kitchen"), v.literal("mart")),
      productIds: v.array(v.id("products")),
      partyPrice: v.number(),
      mrp: v.number(),
      savings: v.number(),
      serves: v.number(),
      image: v.optional(v.string()),
      weight: v.optional(v.string()),
      status: v.union(v.literal("active"), v.literal("inactive")),
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("status", ["status"]),

    // ─── Orders ───
    orders: defineTable({
      orderNumber: v.string(),
      customerId: v.id("users"),
      customerName: v.optional(v.string()),
      customerPhone: v.optional(v.string()),
      customerEmail: v.optional(v.string()),
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
      discount: v.optional(v.number()),
      couponId: v.optional(v.id("coupons")),
      couponCode: v.optional(v.string()),
      total: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("preparing"),
        v.literal("ready"),
        v.literal("out-for-delivery"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
      paymentMethod: v.union(v.literal("cash"), v.literal("upi"), v.literal("pending")),
      paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed"), v.literal("refunded")),
      upiTransactionId: v.optional(v.string()),
      deliveryAddress: v.optional(v.string()),
      deliveryCity: v.optional(v.string()),
      deliveryPincode: v.optional(v.string()),
      orderType: v.union(v.literal("delivery"), v.literal("takeaway")),
      note: v.optional(v.string()),
      estimatedDelivery: v.optional(v.number()),
      acceptedAt: v.optional(v.number()),
      preparingAt: v.optional(v.number()),
      readyAt: v.optional(v.number()),
      outForDeliveryAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      cancelledAt: v.optional(v.number()),
      cancellationReason: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("orderNumber", ["orderNumber"])
      .index("customer", ["customerId"])
      .index("status", ["status"])
      .index("createdAt", ["createdAt"]),

    // ─── Order Items (denormalized for easy querying) ───
    orderItems: defineTable({
      orderId: v.id("orders"),
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.optional(v.string()),
      weight: v.optional(v.string()),
      veg: v.optional(v.boolean()),
    })
      .index("order", ["orderId"])
      .index("product", ["productId"]),

    // ─── Reviews ───
    reviews: defineTable({
      productId: v.id("products"),
      customerId: v.id("users"),
      customerName: v.string(),
      rating: v.number(),
      comment: v.string(),
      images: v.optional(v.array(v.string())),
      isVerifiedPurchase: v.optional(v.boolean()),
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("hidden")),
      isPinned: v.optional(v.boolean()),
      isFeatured: v.optional(v.boolean()),
      moderatedBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("product", ["productId"])
      .index("customer", ["customerId"])
      .index("status", ["status"]),

    // ─── Coupons ───
    coupons: defineTable({
      code: v.string(),
      type: v.union(v.literal("percentage"), v.literal("flat")),
      value: v.number(),
      minOrder: v.optional(v.number()),
      maxDiscount: v.optional(v.number()),
      usageLimit: v.optional(v.number()),
      usedCount: v.optional(v.number()),
      businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
      validFrom: v.number(),
      validUntil: v.number(),
      isActive: v.boolean(),
      description: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("code", ["code"])
      .index("active", ["isActive"]),

    // ─── Offers ───
    offers: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      type: v.union(v.literal("flash-sale"), v.literal("festival"), v.literal("category"), v.literal("product")),
      referenceId: v.optional(v.string()),
      discountPercent: v.optional(v.number()),
      discountFlat: v.optional(v.number()),
      minOrder: v.optional(v.number()),
      code: v.optional(v.string()),
      image: v.optional(v.string()),
      validFrom: v.number(),
      validUntil: v.number(),
      isActive: v.boolean(),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("active", ["isActive"])
      .index("type", ["type"]),

    // ─── Inventory ───
    inventory: defineTable({
      productId: v.id("products"),
      quantity: v.number(),
      lowStockLimit: v.optional(v.number()),
      lastRestockedAt: v.optional(v.number()),
    })
      .index("product", ["productId"]),

    // ─── Stock History ───
    stockHistory: defineTable({
      productId: v.id("products"),
      changeType: v.union(v.literal("addition"), v.literal("deduction"), v.literal("adjustment"), v.literal("sale")),
      quantity: v.number(),
      previousStock: v.number(),
      newStock: v.number(),
      reference: v.optional(v.string()),
      note: v.optional(v.string()),
      changedBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("product", ["productId"])
      .index("createdAt", ["createdAt"]),

    // ─── Delivery Charges ───
    deliveryCharges: defineTable({
      minDistance: v.optional(v.number()),
      maxDistance: v.optional(v.number()),
      charge: v.number(),
      minOrderFree: v.optional(v.number()),
      estimatedMinutes: v.optional(v.number()),
      isActive: v.boolean(),
      updatedAt: v.number(),
    }),

    // ─── Admin Sessions ───
    adminSessions: defineTable({
      userId: v.id("users"),
      token: v.string(),
      ipAddress: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      expiresAt: v.number(),
      createdAt: v.number(),
    })
      .index("user", ["userId"])
      .index("token", ["token"]),

    // ─── Recovery Keys ───
    recoveryKeys: defineTable({
      userId: v.id("users"),
      key: v.string(),
      usedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("user", ["userId"])
      .index("key", ["key"]),

    // ─── Audit Logs ───
    auditLogs: defineTable({
      userId: v.optional(v.id("users")),
      action: v.string(),
      entityType: v.string(),
      entityId: v.optional(v.string()),
      details: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("user", ["userId"])
      .index("createdAt", ["createdAt"])
      .index("entity", ["entityType", "entityId"]),

    // ─── Notifications ───
    notifications: defineTable({
      userId: v.id("users"),
      title: v.string(),
      message: v.string(),
      type: v.union(v.literal("order"), v.literal("admin"), v.literal("promotion"), v.literal("system")),
      read: v.boolean(),
      referenceId: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("user", ["userId"])
      .index("read", ["userId", "read"]),

    // ─── FAQs ───
    faqs: defineTable({
      question: v.string(),
      answer: v.string(),
      category: v.optional(v.string()),
      order: v.optional(v.number()),
      status: v.union(v.literal("active"), v.literal("inactive")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("order", ["order"]),

    // ─── Blogs ───
    blogs: defineTable({
      title: v.string(),
      slug: v.string(),
      content: v.optional(v.string()),
      excerpt: v.optional(v.string()),
      image: v.optional(v.string()),
      author: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      status: v.union(v.literal("draft"), v.literal("published")),
      publishedAt: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("status", ["status"]),

    // ─── Banners ───
    banners: defineTable({
      title: v.string(),
      subtitle: v.optional(v.string()),
      image: v.optional(v.string()),
      link: v.optional(v.string()),
      businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
      sortOrder: v.optional(v.number()),
      status: v.union(v.literal("active"), v.literal("inactive")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("status", ["status"]),

    // ─── Testimonials ───
    testimonials: defineTable({
      name: v.string(),
      city: v.optional(v.string()),
      comment: v.string(),
      rating: v.number(),
      avatar: v.optional(v.string()),
      status: v.union(v.literal("active"), v.literal("inactive")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),

    // ─── Contact Messages ───
    contactMessages: defineTable({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      subject: v.optional(v.string()),
      message: v.string(),
      read: v.boolean(),
      replied: v.boolean(),
      createdAt: v.number(),
    }).index("read", ["read"]),

    // ─── Newsletter Subscribers ───
    newsletterSubscribers: defineTable({
      email: v.string(),
      subscribed: v.boolean(),
      createdAt: v.number(),
    })
      .index("email", ["email"]),

    // ─── Business Hours ───
    businessHours: defineTable({
      day: v.union(
        v.literal("monday"), v.literal("tuesday"), v.literal("wednesday"),
        v.literal("thursday"), v.literal("friday"), v.literal("saturday"),
        v.literal("sunday"),
      ),
      open: v.optional(v.string()),
      close: v.optional(v.string()),
      isOpen: v.boolean(),
    }),

    // ─── Payment Settings ───
    paymentSettings: defineTable({
      upiId: v.optional(v.string()),
      upiQrImage: v.optional(v.string()),
      accountHolder: v.optional(v.string()),
      bankName: v.optional(v.string()),
      accountNumber: v.optional(v.string()),
      ifscCode: v.optional(v.string()),
      cashEnabled: v.boolean(),
      upiEnabled: v.boolean(),
      whatsappConfirmation: v.boolean(),
      razorpayEnabled: v.optional(v.boolean()),
      razorpayKeyId: v.optional(v.string()),
      razorpayKeySecret: v.optional(v.string()),
      updatedAt: v.number(),
    }),

    // ─── Branding Settings ───
    brandingSettings: defineTable({
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      accentColor: v.optional(v.string()),
      logo: v.optional(v.string()),
      favicon: v.optional(v.string()),
      storeName: v.optional(v.string()),
      tagline: v.optional(v.string()),
      aboutText: v.optional(v.string()),
      updatedAt: v.number(),
    }),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
