import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { meltdownId: v.id("meltdowns") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_meltdown", (q) => q.eq("meltdownId", args.meltdownId))
      .order("asc")
      .collect();

    return await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          authorName: author?.name ?? "Anonymous",
          authorAvatarUrl: author?.avatarUrl,
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    meltdownId: v.id("meltdowns"),
    body: v.string(),
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

    if (!args.body.trim()) throw new Error("Comment cannot be empty");
    if (args.body.length > 500)
      throw new Error("Comment must be under 500 characters");

    await ctx.db.insert("comments", {
      meltdownId: args.meltdownId,
      authorId: user._id,
      body: args.body.trim(),
    });

    await ctx.db.patch(args.meltdownId, {
      commentCount: meltdown.commentCount + 1,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("comments") },
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

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");
    if (comment.authorId !== user._id) throw new Error("Not authorized");

    const meltdown = await ctx.db.get(comment.meltdownId);
    if (meltdown) {
      await ctx.db.patch(comment.meltdownId, {
        commentCount: Math.max(0, meltdown.commentCount - 1),
      });
    }

    await ctx.db.delete(args.id);
  },
});
