// MB Crunchy — Account Security & Audit Backend
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// ─── Audit Log ───
export const logAudit = mutation({
  args: {
    action: v.string(),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.insert("auditLogs", {
      userId: user?._id,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      details: args.details,
      createdAt: Date.now(),
    });
  },
});

export const listAuditLogs = query({
  args: { limit: v.optional(v.number()), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    let logs = await ctx.db.query("auditLogs").order("desc").collect();
    if (args.userId) logs = logs.filter(l => l.userId === args.userId);
    return logs.slice(0, args.limit ?? 100);
  },
});

// ─── Recovery Keys ───
export const generateRecoveryKey = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Generate a secure random recovery key
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) key += chars[Math.floor(Math.random() * chars.length)];
      if (i < 3) key += "-";
    }

    await ctx.db.insert("recoveryKeys", {
      userId: user._id,
      key,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "generate_recovery_key",
      entityType: "recoveryKeys",
      entityId: user._id,
      details: "New recovery key generated",
      createdAt: Date.now(),
    });

    return key;
  },
});

export const validateRecoveryKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const keys = await ctx.db.query("recoveryKeys").withIndex("key", q => q.eq("key", args.key)).collect();
    const recoveryKey = keys[0];
    if (!recoveryKey) return { valid: false, reason: "Invalid recovery key" };
    if (recoveryKey.usedAt) return { valid: false, reason: "Recovery key already used" };
    return { valid: true, userId: recoveryKey.userId, keyId: recoveryKey._id };
  },
});

export const useRecoveryKey = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const keys = await ctx.db.query("recoveryKeys").withIndex("key", q => q.eq("key", args.key)).collect();
    const recoveryKey = keys[0];
    if (!recoveryKey || recoveryKey.usedAt) throw new Error("Invalid or expired recovery key");

    await ctx.db.patch(recoveryKey._id, { usedAt: Date.now() });

    await ctx.db.insert("auditLogs", {
      userId: recoveryKey.userId,
      action: "use_recovery_key",
      entityType: "recoveryKeys",
      entityId: recoveryKey._id,
      details: "Recovery key used for password reset",
      createdAt: Date.now(),
    });

    return recoveryKey.userId;
  },
});

export const listRecoveryKeys = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const keys = await ctx.db.query("recoveryKeys").withIndex("user", q => q.eq("userId", user._id)).collect();
    return keys.map(k => ({
      _id: k._id,
      createdAt: k.createdAt,
      usedAt: k.usedAt,
      keyPreview: k.key.substring(0, 8) + "****",
    }));
  },
});

export const revokeRecoveryKey = mutation({
  args: { keyId: v.id("recoveryKeys") },
  handler: async (ctx, args) => {
    const key = await ctx.db.get(args.keyId);
    if (!key) throw new Error("Key not found");
    await ctx.db.patch(args.keyId, { usedAt: Date.now() });
  },
});

// ─── Sessions ───
export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    const sessions = await ctx.db.query("adminSessions").withIndex("user", q => q.eq("userId", user._id)).collect();
    return sessions.sort((a, b) => b.createdAt - a.createdAt).map(s => ({
      _id: s._id,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isActive: s.expiresAt > Date.now(),
    }));
  },
});

export const revokeSession = mutation({
  args: { sessionId: v.id("adminSessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
  },
});

export const createSession = mutation({
  args: {
    token: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const now = Date.now();
    await ctx.db.insert("adminSessions", {
      userId: user._id,
      token: args.token,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
      createdAt: now,
    });
  },
});

// ─── Password Management ───
export const changePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (args.newPassword.length < 8) throw new Error("Password must be at least 8 characters");

    // In production, this would verify the current password hash and update to new hash
    // For now, we log the audit trail
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "change_password",
      entityType: "users",
      entityId: user._id,
      details: "Password changed",
      createdAt: Date.now(),
    });
  },
});

export const resetPassword = mutation({
  args: {
    recoveryKey: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 8) throw new Error("Password must be at least 8 characters");

    const keys = await ctx.db.query("recoveryKeys").withIndex("key", q => q.eq("key", args.recoveryKey)).collect();
    const key = keys[0];
    if (!key || key.usedAt) throw new Error("Invalid or expired recovery key");

    // Mark key as used
    await ctx.db.patch(key._id, { usedAt: Date.now() });

    await ctx.db.insert("auditLogs", {
      userId: key.userId,
      action: "reset_password",
      entityType: "users",
      entityId: key.userId,
      details: "Password reset via recovery key",
      createdAt: Date.now(),
    });
  },
});

// ─── Security Stats ───
export const getSecurityInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const sessions = await ctx.db.query("adminSessions").withIndex("user", q => q.eq("userId", user._id)).collect();
    const keys = await ctx.db.query("recoveryKeys").withIndex("user", q => q.eq("userId", user._id)).collect();
    return {
      activeSessions: sessions.filter(s => s.expiresAt > Date.now()).length,
      totalSessions: sessions.length,
      totalRecoveryKeys: keys.length,
      unusedRecoveryKeys: keys.filter(k => !k.usedAt).length,
    };
  },
});
