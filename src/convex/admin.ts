// MB Crunchy — Admin Authentication & Role Management
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Check if the current authenticated user has admin role
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;
    return user.role === "admin" || user.role === "manager";
  },
});

// Get the current admin user info (or null)
export const getCurrentAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    if (user.role !== "admin" && user.role !== "manager") return null;
    return user;
  },
});

// Update a user's role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("customer")),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") throw new Error("Only admins can change roles");
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

// Set the first user who calls this as admin (for initial setup)
export const claimAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be authenticated");

    // Check if any admin already exists
    const allUsers = await ctx.db.query("users").collect();
    const existingAdmin = allUsers.find(u => u.role === "admin");
    if (existingAdmin) throw new Error("An admin already exists. Contact your admin to set your role.");

    // Set this user as admin
    await ctx.db.patch(user._id, { role: "admin" });
  },
});
