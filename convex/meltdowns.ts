import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    sortBy: v.optional(v.union(v.literal("recent"), v.literal("top"))),
    category: v.optional(
      v.union(
        v.literal("food"),
        v.literal("bedtime"),
        v.literal("getting_dressed"),
        v.literal("wrong_cup"),
        v.literal("toys"),
        v.literal("screen_time"),
        v.literal("literally_nothing"),
        v.literal("impossible_request")
      )
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const sortBy = args.sortBy ?? "recent";

    let q;
    if (args.category) {
      q = ctx.db
        .query("meltdowns")
        .withIndex("by_category", (idx) => idx.eq("category", args.category!));
    } else if (sortBy === "top") {
      q = ctx.db
        .query("meltdowns")
        .withIndex("by_total_score")
        .order("desc");
    } else {
      q = ctx.db.query("meltdowns").order("desc");
    }

    const results = await q.paginate(args.paginationOpts);

    // If we're filtering by category and sorting by top, sort in memory
    let page = results.page;
    if (args.category && sortBy === "top") {
      page = [...page].sort((a, b) => b.totalScore - a.totalScore);
    }

    // Enrich with author info
    const enrichedPage = await Promise.all(
      page.map(async (meltdown) => {
        const author = await ctx.db.get(meltdown.authorId);
        return {
          ...meltdown,
          authorName: author?.name ?? "Anonymous",
          authorAvatarUrl: author?.avatarUrl,
        };
      })
    );

    return {
      ...results,
      page: enrichedPage,
    };
  },
});

export const get = query({
  args: { id: v.id("meltdowns") },
  handler: async (ctx, args) => {
    const meltdown = await ctx.db.get(args.id);
    if (!meltdown) return null;

    const author = await ctx.db.get(meltdown.authorId);

    return {
      ...meltdown,
      authorName: author?.name ?? "Anonymous",
      authorAvatarUrl: author?.avatarUrl,
    };
  },
});

export const create = mutation({
  args: {
    childType: v.union(
      v.literal("toddler"),
      v.literal("baby"),
      v.literal("kid")
    ),
    story: v.string(),
    category: v.union(
      v.literal("food"),
      v.literal("bedtime"),
      v.literal("getting_dressed"),
      v.literal("wrong_cup"),
      v.literal("toys"),
      v.literal("screen_time"),
      v.literal("literally_nothing"),
      v.literal("impossible_request")
    ),
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

    if (!args.story.trim()) throw new Error("Story cannot be empty");
    if (args.story.length > 1000)
      throw new Error("Story must be under 1000 characters");

    return await ctx.db.insert("meltdowns", {
      authorId: user._id,
      childType: args.childType,
      story: args.story.trim(),
      category: args.category,
      reactionCounts: { been_there: 0, laughing: 0 },
      totalScore: 0,
      commentCount: 0,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("meltdowns") },
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

    const meltdown = await ctx.db.get(args.id);
    if (!meltdown) throw new Error("Meltdown not found");
    if (meltdown.authorId !== user._id) throw new Error("Not authorized");

    // Delete all reactions for this meltdown
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_meltdown", (q) => q.eq("meltdownId", args.id))
      .collect();
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    // Delete all comments for this meltdown
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_meltdown", (q) => q.eq("meltdownId", args.id))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const listByUser = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("meltdowns")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const author = await ctx.db.get(args.userId);

    const enrichedPage = results.page.map((meltdown) => ({
      ...meltdown,
      authorName: author?.name ?? "Anonymous",
      authorAvatarUrl: author?.avatarUrl,
    }));

    return { ...results, page: enrichedPage };
  },
});
