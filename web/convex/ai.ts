import { action } from "./_generated/server";
import { v } from "convex/values";
export const generateList = action({
    args: { destination: v.string(), startDate: v.string(), endDate: v.string(), activities: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    {
                        role: "system", content: `You are PackingList, a smart travel packing assistant. Generate a comprehensive packing list based on destination, dates, weather, and planned activities. Output JSON:
{"destination":"","startDate":"","endDate":"","categories":[{"name":"<Clothing|Toiletries|Electronics|Documents|Misc>","items":[{"item":"<item>","quantity":<n>,"essential":<bool>}]}],"tips":["tip1","tip2"]}` },
                    { role: "user", content: `Destination: ${args.destination}\nDates: ${args.startDate} to ${args.endDate}${args.activities ? `\nActivities: ${args.activities}` : ''}` },
                ], temperature: 0.5, max_tokens: 3000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error`);
        return JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
    },
});
