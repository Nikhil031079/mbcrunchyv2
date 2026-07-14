// MB Crunchy — Convex File Storage Utilities
// All image uploads go through Convex File Storage. No base64 in the database.
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a one-time upload URL for clients to POST files to Convex Storage
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get a public URL from a storageId (use after upload to resolve the URL)
export const resolveFileUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    const url = await ctx.storage.getUrl(storageId);
    return url;
  },
});

// Delete a file from Convex Storage by storageId
export const deleteFile = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    await ctx.storage.delete(storageId);
  },
});
