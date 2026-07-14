import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// ─── Blogs ───
export const listBlogs = query({
  args: { status: v.optional(v.union(v.literal("draft"), v.literal("published"))) },
  handler: async (ctx, args) => {
    let blogs = await ctx.db.query("blogs").collect();
    if (args.status) blogs = blogs.filter(b => b.status === args.status);
    return blogs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    author: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const now = Date.now();
    return await ctx.db.insert("blogs", { ...args, createdBy: user?._id, publishedAt: args.status === "published" ? now : undefined, createdAt: now, updatedAt: now });
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    author: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const now = Date.now();
    const patch: any = { ...fields, updatedAt: now };
    if (fields.status === "published") patch.publishedAt = now;
    await ctx.db.patch(id, patch);
  },
});

export const removeBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

// ─── FAQs ───
export const listFaqs = query({
  args: { status: v.optional(v.union(v.literal("active"), v.literal("inactive"))) },
  handler: async (ctx, args) => {
    let faqs = await ctx.db.query("faqs").collect();
    if (args.status) faqs = faqs.filter(f => f.status === args.status);
    return faqs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  },
});

export const createFaq = mutation({
  args: { question: v.string(), answer: v.string(), category: v.optional(v.string()), order: v.optional(v.number()), status: v.union(v.literal("active"), v.literal("inactive")) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("faqs", { ...args, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updateFaq = mutation({
  args: {
    id: v.id("faqs"), question: v.optional(v.string()), answer: v.optional(v.string()),
    category: v.optional(v.string()), order: v.optional(v.number()), status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const removeFaq = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

// ─── Banners ───
export const listBanners = query({
  args: { status: v.optional(v.union(v.literal("active"), v.literal("inactive"))) },
  handler: async (ctx, args) => {
    let banners = await ctx.db.query("banners").collect();
    if (args.status) banners = banners.filter(b => b.status === args.status);
    return banners.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  },
});

export const createBanner = mutation({
  args: {
    title: v.string(), subtitle: v.optional(v.string()), image: v.optional(v.string()),
    link: v.optional(v.string()), businessType: v.union(v.literal("kitchen"), v.literal("mart"), v.literal("both")),
    sortOrder: v.optional(v.number()), status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("banners", { ...args, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updateBanner = mutation({
  args: {
    id: v.id("banners"), title: v.optional(v.string()), subtitle: v.optional(v.string()),
    link: v.optional(v.string()), sortOrder: v.optional(v.number()), status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const removeBanner = mutation({
  args: { id: v.id("banners") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

// ─── Testimonials ───
export const listTestimonials = query({
  args: { status: v.optional(v.union(v.literal("active"), v.literal("inactive"))) },
  handler: async (ctx, args) => {
    let testimonials = await ctx.db.query("testimonials").collect();
    if (args.status) testimonials = testimonials.filter(t => t.status === args.status);
    return testimonials.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const createTestimonial = mutation({
  args: { name: v.string(), city: v.optional(v.string()), comment: v.string(), rating: v.number(), status: v.union(v.literal("active"), v.literal("inactive")) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testimonials", { ...args, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updateTestimonial = mutation({
  args: {
    id: v.id("testimonials"), name: v.optional(v.string()), city: v.optional(v.string()),
    comment: v.optional(v.string()), rating: v.optional(v.number()), status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const removeTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

// ─── Contact Messages ───
export const listContactMessages = query({
  args: { read: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let msgs = await ctx.db.query("contactMessages").collect();
    if (args.read !== undefined) msgs = msgs.filter(m => m.read === args.read);
    return msgs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const markAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => await ctx.db.patch(args.id, { read: true }),
});

export const removeContactMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});

// ─── Newsletter ───
export const listSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db.query("newsletterSubscribers").collect();
    return subs.filter(s => s.subscribed).sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const removeSubscriber = mutation({
  args: { id: v.id("newsletterSubscribers") },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});
