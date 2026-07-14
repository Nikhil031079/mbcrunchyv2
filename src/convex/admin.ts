// MB Crunchy — Admin Password Authentication (PBKDF2-SHA512)
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 48; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

function generateRecoveryKeyString(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) key += chars[Math.floor(Math.random() * chars.length)];
    if (i < 3) key += "-";
  }
  return key;
}

async function pbkdf2Hash(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-512" },
    keyMaterial, 512
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Check if admin password is set up
export const getAdminAuthStatus = query({
  args: {},
  handler: async (ctx) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    return { isSetup: auths.length > 0 && !!(auths[0] as any)?.passwordHash };
  },
});

// Check if current session is valid (read-only query)
export const verifySession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth) return { valid: false, reason: "No admin configured" };
    if (auth.sessionToken !== args.token) return { valid: false, reason: "Invalid session" };
    if (auth.sessionExpiry && auth.sessionExpiry < Date.now()) return { valid: false, reason: "Session expired" };
    return { valid: true };
  },
});

// Setup initial admin password (first time)
export const setupPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const existing = auths[0] as any;
    if (existing?.passwordHash) throw new Error("Admin password already set up");
    if (args.password.length < 8) throw new Error("Password must be at least 8 characters");
    if (!/[A-Z]/.test(args.password)) throw new Error("Must contain uppercase letter");
    if (!/[a-z]/.test(args.password)) throw new Error("Must contain lowercase letter");
    if (!/[0-9]/.test(args.password)) throw new Error("Must contain a number");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(args.password)) throw new Error("Must contain special character");
    const salt = generateToken().substring(0, 32);
    const hash = await pbkdf2Hash(args.password, salt);
    if (existing) {
      await ctx.db.patch(existing._id, { passwordHash: hash, passwordSalt: salt, failedAttempts: 0, passwordChangedAt: Date.now() } as any);
    } else {
      await ctx.db.insert("adminAuth" as any, { passwordHash: hash, passwordSalt: salt, failedAttempts: 0, passwordChangedAt: Date.now() } as any);
    }
  },
});

// Admin login
export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth?.passwordHash) throw new Error("No admin password configured");
    if (auth.lockedUntil && auth.lockedUntil > Date.now()) {
      const remaining = Math.ceil((auth.lockedUntil - Date.now()) / 1000);
      throw new Error(`Account locked. Try again in ${remaining} seconds`);
    }
    const hash = await pbkdf2Hash(args.password, auth.passwordSalt);
    if (hash !== auth.passwordHash) {
      const attempts = (auth.failedAttempts || 0) + 1;
      if (attempts >= 5) {
        await ctx.db.patch(auth._id, { failedAttempts: attempts, lockedUntil: Date.now() + 15 * 60 * 1000 } as any);
        throw new Error("Account locked for 15 minutes due to too many failed attempts");
      }
      await ctx.db.patch(auth._id, { failedAttempts: attempts } as any);
      throw new Error(`Invalid password (${attempts}/5 attempts)`);
    }
    const token = generateToken();
    await ctx.db.patch(auth._id, { failedAttempts: 0, lockedUntil: undefined, sessionToken: token, sessionExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000 } as any);
    await ctx.db.insert("auditLogs", { action: "admin_login", entityType: "adminAuth", details: "Admin logged in", createdAt: Date.now() });
    return { token, expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  },
});

// Logout
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (auth && auth.sessionToken === args.token) {
      await ctx.db.patch(auth._id, { sessionToken: undefined, sessionExpiry: undefined } as any);
      await ctx.db.insert("auditLogs", { action: "admin_logout", entityType: "adminAuth", details: "Admin logged out", createdAt: Date.now() });
    }
  },
});

// Change password
export const changePassword = mutation({
  args: { currentPassword: v.string(), newPassword: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth || auth.sessionToken !== args.token) throw new Error("Not authenticated");
    const currentHash = await pbkdf2Hash(args.currentPassword, auth.passwordSalt);
    if (currentHash !== auth.passwordHash) throw new Error("Current password is incorrect");
    if (args.newPassword.length < 8) throw new Error("Min 8 characters");
    if (!/[A-Z]/.test(args.newPassword)) throw new Error("Need uppercase letter");
    if (!/[a-z]/.test(args.newPassword)) throw new Error("Need lowercase letter");
    if (!/[0-9]/.test(args.newPassword)) throw new Error("Need number");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(args.newPassword)) throw new Error("Need special character");
    const newSalt = generateToken().substring(0, 32);
    const newHash = await pbkdf2Hash(args.newPassword, newSalt);
    await ctx.db.patch(auth._id, { passwordHash: newHash, passwordSalt: newSalt, passwordChangedAt: Date.now() } as any);
    await ctx.db.insert("auditLogs", { action: "change_password", entityType: "adminAuth", details: "Password changed", createdAt: Date.now() });
  },
});

// Generate recovery key
export const generateRecoveryKey = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth || auth.sessionToken !== args.token) throw new Error("Not authenticated");
    const plainKey = generateRecoveryKeyString();
    const salt = generateToken().substring(0, 32);
    const hash = await pbkdf2Hash(plainKey, salt);
    await ctx.db.patch(auth._id, { recoveryKeyHash: hash, recoveryKeySalt: salt, recoveryKeyPlain: plainKey } as any);
    await ctx.db.insert("auditLogs", { action: "generate_recovery_key", entityType: "adminAuth", details: "New recovery key generated", createdAt: Date.now() });
    return plainKey;
  },
});

// Reset password with recovery key
export const resetPasswordWithRecoveryKey = mutation({
  args: { recoveryKey: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth?.recoveryKeyHash) throw new Error("No recovery key configured");
    const keyHash = await pbkdf2Hash(args.recoveryKey.toUpperCase(), auth.recoveryKeySalt!);
    if (keyHash !== auth.recoveryKeyHash) throw new Error("Invalid recovery key");
    if (args.newPassword.length < 8) throw new Error("Min 8 characters");
    if (!/[A-Z]/.test(args.newPassword)) throw new Error("Need uppercase letter");
    if (!/[a-z]/.test(args.newPassword)) throw new Error("Need lowercase letter");
    if (!/[0-9]/.test(args.newPassword)) throw new Error("Need number");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(args.newPassword)) throw new Error("Need special character");
    const newSalt = generateToken().substring(0, 32);
    const newHash = await pbkdf2Hash(args.newPassword, newSalt);
    await ctx.db.patch(auth._id, { passwordHash: newHash, passwordSalt: newSalt, passwordChangedAt: Date.now(), sessionToken: undefined, sessionExpiry: undefined, recoveryKeyHash: undefined, recoveryKeySalt: undefined, recoveryKeyPlain: undefined } as any);
    await ctx.db.insert("auditLogs", { action: "reset_password", entityType: "adminAuth", details: "Password reset via recovery key", createdAt: Date.now() });
  },
});

// Get security info
export const getSecurityInfo = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth || auth.sessionToken !== args.token) return null;
    return { passwordChangedAt: auth.passwordChangedAt, hasRecoveryKey: !!auth.recoveryKeyHash, recoveryKeyPlain: auth.recoveryKeyPlain || null, failedAttempts: auth.failedAttempts || 0, lockedUntil: auth.lockedUntil, sessionExpiry: auth.sessionExpiry };
  },
});

// Clear recovery key after viewing
export const clearRecoveryKeyView = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    const auth = auths[0] as any;
    if (!auth || auth.sessionToken !== args.token) throw new Error("Not authenticated");
    await ctx.db.patch(auth._id, { recoveryKeyPlain: undefined } as any);
  },
});

// Check if recovery key exists
export const hasRecoveryKey = query({
  args: {},
  handler: async (ctx) => {
    const auths = await ctx.db.query("adminAuth" as any).collect();
    return auths.length > 0 && !!(auths[0] as any)?.recoveryKeyHash;
  },
});
