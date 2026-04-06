import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function extractName(identity: {
  name?: string | null;
  nickname?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  email?: string | null;
}): string {
  // Try name first
  if (identity.name && identity.name.trim()) return identity.name.trim();
  // Try nickname
  if (identity.nickname && identity.nickname.trim())
    return identity.nickname.trim();
  // Try given + family name
  const given = identity.givenName?.trim() ?? "";
  const family = identity.familyName?.trim() ?? "";
  const full = `${given} ${family}`.trim();
  if (full) return full;
  // Fall back to email prefix
  if (identity.email) {
    const prefix = identity.email.split("@")[0];
    if (prefix) return prefix;
  }
  return "Anonymous";
}

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called store without authentication present");
    }

    const name = extractName(identity);
    const avatarUrl = identity.pictureUrl;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // Only update if name was previously Anonymous or avatar changed
      if (
        (user.name === "Anonymous" && name !== "Anonymous") ||
        user.avatarUrl !== avatarUrl
      ) {
        await ctx.db.patch(user._id, {
          name: user.name === "Anonymous" ? name : user.name,
          avatarUrl,
        });
      }
      return user._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      name,
      avatarUrl,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const trimmed = args.name.trim();
    if (!trimmed) throw new Error("Name cannot be empty");
    if (trimmed.length > 50) throw new Error("Name must be under 50 characters");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { name: trimmed });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
