import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  packingLists: defineTable({
    destination: v.string(), startDate: v.string(), endDate: v.string(), activities: v.optional(v.string()),
    categories: v.array(v.object({ name: v.string(), items: v.array(v.object({ item: v.string(), quantity: v.number(), essential: v.boolean() })) })),
    tips: v.array(v.string()), createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
