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
    image: v.optional(v.string()),
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
    image: v.optional(v.string()),
    author: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 1,577 characters. Read it separately or use code_search for the relevant section.