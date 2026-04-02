import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const categoryValues = v.union(
  v.literal("food"),
  v.literal("bedtime"),
  v.literal("getting_dressed"),
  v.literal("wrong_cup"),
  v.literal("toys"),
  v.literal("screen_time"),
  v.literal("literally_nothing"),
  v.literal("impossible_request")
);

export const reactionTypeValues = v.union(
  v.literal("been_there"),
  v.literal("laughing")
);

export default defineSchema({
  users: defineTable({
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  meltdowns: defineTable({
    authorId: v.id("users"),
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
    reactionCounts: v.object({
      been_there: v.number(),
      laughing: v.number(),
    }),
    totalScore: v.number(),
    commentCount: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_category", ["category"])
    .index("by_total_score", ["totalScore"]),

  reactions: defineTable({
    meltdownId: v.id("meltdowns"),
    userId: v.id("users"),
    type: v.union(v.literal("been_there"), v.literal("laughing")),
  })
    .index("by_meltdown", ["meltdownId"])
    .index("by_user_meltdown", ["userId", "meltdownId"]),

  comments: defineTable({
    meltdownId: v.id("meltdowns"),
    authorId: v.id("users"),
    body: v.string(),
  }).index("by_meltdown", ["meltdownId"]),
});
