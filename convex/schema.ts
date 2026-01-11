import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  games: defineTable({
    players: v.array(v.string()), // Array of player names (up to 4)
    winner: v.string(), // Name of the winner
    points: v.object({
      // Points scored by each player
      [v.string()]: v.number(),
    }),
    startTime: v.number(), // Unix timestamp
    endTime: v.number(), // Unix timestamp
  }).index("by_creation_time", ["_creationTime"]),
});

export default schema;
