import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all games
export const listGames = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be logged in to view games");
    }

    const games = await ctx.db
      .query("games")
      .order("desc")
      .collect();

    // Add computed duration to each game
    return games.map((game) => ({
      ...game,
      duration: game.endTime - game.startTime,
    }));
  },
});

// Get a single game by ID
export const getGame = query({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be logged in to view game");
    }

    const game = await ctx.db.get(args.id);
    if (!game) {
      return null;
    }

    return {
      ...game,
      duration: game.endTime - game.startTime,
    };
  },
});

// Get leaderboard with win counts
export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be logged in to view leaderboard");
    }

    const games = await ctx.db.query("games").collect();

    // Count wins for each player
    const winCounts = new Map<string, number>();
    const gamesPlayed = new Map<string, number>();

    for (const game of games) {
      // Count win
      winCounts.set(game.winner, (winCounts.get(game.winner) || 0) + 1);

      // Count games played for all players
      for (const player of game.players) {
        gamesPlayed.set(player, (gamesPlayed.get(player) || 0) + 1);
      }
    }

    // Create leaderboard entries
    const leaderboard = Array.from(winCounts.entries()).map(([player, wins]) => ({
      player,
      wins,
      gamesPlayed: gamesPlayed.get(player) || 0,
      winRate: ((wins / (gamesPlayed.get(player) || 1)) * 100).toFixed(1),
    }));

    // Sort by wins (descending)
    leaderboard.sort((a, b) => b.wins - a.wins);

    return leaderboard;
  },
});
