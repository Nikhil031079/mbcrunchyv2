// MB Crunchy — About Page Content Backend
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const pages = await ctx.db.query("aboutPages" as any).collect();
    return pages[0] ?? null;
  },
});

export const update = mutation({
  args: {
    heroTitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    storyTitle: v.optional(v.string()),
    storyContent: v.optional(v.string()),
    missionTitle: v.optional(v.string()),
    missionContent: v.optional(v.string()),
    visionTitle: v.optional(v.string()),
    visionContent: v.optional(v.string()),
    whyChooseUs: v.optional(v.array(v.object({
      icon: v.optional(v.string()),
      title: v.string(),
      description: v.string(),
    }))),
    images: v.optional(v.array(v.string())),
    ownerMessage: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("aboutPages" as any).collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("aboutPages" as any, { ...args, updatedAt: Date.now() } as any);
    }
  },
});
