import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveList = mutation({
  args: { destination: v.string(), startDate: v.string(), endDate: v.string(), activities: v.optional(v.string()), categories: v.array(v.object({ name: v.string(), items: v.array(v.object({ item: v.string(), quantity: v.number(), essential: v.boolean() })) })), tips: v.array(v.string()) },
  handler: async (ctx, args) => await ctx.db.insert("packingLists", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("packingLists").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
