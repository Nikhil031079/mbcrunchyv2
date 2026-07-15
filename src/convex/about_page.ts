// MB Crunchy — About Page Full CMS Backend
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const teamMemberSchema = v.object({
  name: v.string(),
  designation: v.optional(v.string()),
  photo: v.optional(v.string()),
  description: v.optional(v.string()),
});

const timelineEntrySchema = v.object({
  year: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
});

const statisticSchema = v.object({
  label: v.string(),
  value: v.number(),
  suffix: v.optional(v.string()),
});

const whyChooseUsSchema = v.object({
  icon: v.optional(v.string()),
  title: v.string(),
  description: v.string(),
});

const awardSchema = v.object({
  title: v.string(),
  year: v.optional(v.string()),
  image: v.optional(v.string()),
  description: v.optional(v.string()),
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const pages = await ctx.db.query("aboutPages" as any).collect();
    return pages[0] ?? null;
  },
});

export const update = mutation({
  args: {
    // Hero
    heroTitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    // Story
    storyTitle: v.optional(v.string()),
    storyContent: v.optional(v.string()),
    storyImage: v.optional(v.string()),
    // Mission & Vision
    missionTitle: v.optional(v.string()),
    missionContent: v.optional(v.string()),
    missionImage: v.optional(v.string()),
    visionTitle: v.optional(v.string()),
    visionContent: v.optional(v.string()),
    visionImage: v.optional(v.string()),
    // Why Choose Us
    whyChooseUs: v.optional(v.array(whyChooseUsSchema)),
    // Statistics
    statistics: v.optional(v.array(statisticSchema)),
    // Journey Timeline
    timelineTitle: v.optional(v.string()),
    timeline: v.optional(v.array(timelineEntrySchema)),
    // Team
    teamTitle: v.optional(v.string()),
    teamMembers: v.optional(v.array(teamMemberSchema)),
    // Founder / Owner
    founderTitle: v.optional(v.string()),
    founderName: v.optional(v.string()),
    founderPhoto: v.optional(v.string()),
    founderMessage: v.optional(v.string()),
    // Certificates & Awards
    certificates: v.optional(v.array(awardSchema)),
    // Gallery
    galleryTitle: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    // Video
    videoUrl: v.optional(v.string()),
    videoTitle: v.optional(v.string()),
    // SEO
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("aboutPages" as any).collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() } as any);
    } else {
      await ctx.db.insert("aboutPages" as any, { ...args, updatedAt: Date.now() } as any);
    }
  },
});
