import { v } from "convex/values";
import { mutation, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new game
export const createGame = mutation({
  args: {
    players: v.array(v.string()),
    winner: v.string(),
    points: v.object({}),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be logged in to create a game");
    }

    // Validate players array (2-4 players)
    if (args.players.length < 2 || args.players.length > 4) {
      throw new Error("Games must have between 2 and 4 players");
    }

    // Validate winner is in players list
    if (!args.players.includes(args.winner)) {
      throw new Error("Winner must be one of the players");
    }

    // Validate timestamps
    if (args.endTime < args.startTime) {
      throw new Error("End time must be after start time");
    }

    const gameId = await ctx.db.insert("games", {
      players: args.players,
      winner: args.winner,
      points: args.points as Record<string, number>,
      startTime: args.startTime,
      endTime: args.endTime,
    });

    return gameId;
  },
});

// Update an existing game
export const updateGame = mutation({
  args: {
    id: v.id("games"),
    players: v.optional(v.array(v.string())),
    winner: v.optional(v.string()),
    points: v.optional(v.object({})),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be logged in to update a game");
    }

    const game = await ctx.db.get(args.id);
    if (!game) {
      throw new Error("Game not found");
    }

    const updates: any = {};
    
    if (args.players !== undefined) {
      if (args.players.length < 2 || args.players.length > 4) {
        throw new Error("Games must have between 2 and 4 players");
      }
      updates.players = args.players;
    }

    if (args.winner !== undefined) {
      const players = args.players || game.players;
      if (!players.includes(args.winner)) {
        throw new Error("Winner must be one of the players");
      }
      updates.winner = args.winner;
    }

    if (args.points !== undefined) {
      updates.points = args.points;
    }

    if (args.startTime !== undefined) {
      updates.startTime = args.startTime;
    }

    if (args.endTime !== undefined) {
      updates.endTime = args.endTime;
    }

    // Validate timestamps if both are being updated
    const startTime = updates.startTime || game.startTime;
    const endTime = updates.endTime || game.endTime;
    if (endTime < startTime) {
      throw new Error("End time must be after start time");
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Delete a game
export const deleteGame = mutation({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be logged in to delete a game");
    }

    const game = await ctx.db.get(args.id);
    if (!game) {
      throw new Error("Game not found");
    }

    await ctx.db.delete(args.id);
  },
});
