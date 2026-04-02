import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: {
    meltdownId: v.id("meltdowns"),
    type: v.union(v.literal("been_there"), v.literal("laughing")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not found");

    const meltdown = await ctx.db.get(args.meltdownId);
    if (!meltdown) throw new Error("Meltdown not found");

    // Check for existing reaction of this type by this user
    const existingReactions = await ctx.db
      .query("reactions")
      .withIndex("by_user_meltdown", (q) =>
        q.eq("userId", user._id).eq("meltdownId", args.meltdownId)
      )
      .collect();

    const existingReaction = existingReactions.find(
      (r) => r.type === args.type
    );

    const newCounts = { ...meltdown.reactionCounts };

    if (existingReaction) {
      // Remove reaction
      await ctx.db.delete(existingReaction._id);
      newCounts[args.type] = Math.max(0, newCounts[args.type] - 1);
    } else {
      // Add reaction
      await ctx.db.insert("reactions", {
        meltdownId: args.meltdownId,
        userId: user._id,
        type: args.type,
      });
      newCounts[args.type] = newCounts[args.type] + 1;
    }

    const totalScore = newCounts.been_there + newCounts.laughing;

    await ctx.db.patch(args.meltdownId, {
      reactionCounts: newCounts,
      totalScore,
    });

    return { added: !existingReaction };
  },
});

export const getUserReactions = query({
  args: { meltdownId: v.id("meltdowns") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) return [];

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_user_meltdown", (q) =>
        q.eq("userId", user._id).eq("meltdownId", args.meltdownId)
      )
      .collect();

    return reactions.map((r) => r.type);
  },
});
