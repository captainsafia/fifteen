<script lang="ts">
	import { onMount } from 'svelte';
	import { convex } from '$lib/convex';
	import { api } from '../../convex/_generated/api';

	let games = $state<any[]>([]);
	let leaderboard = $state<any[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			// Subscribe to games
			const unsubscribeGames = convex.onUpdate(api.queries.listGames, {}, (newGames) => {
				games = newGames;
			});

			// Subscribe to leaderboard
			const unsubscribeLeaderboard = convex.onUpdate(
				api.queries.getLeaderboard,
				{},
				(newLeaderboard) => {
					leaderboard = newLeaderboard;
				}
			);

			loading = false;

			return () => {
				unsubscribeGames();
				unsubscribeLeaderboard();
			};
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load data';
			loading = false;
		}
	});

	function formatDuration(ms: number): string {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}m ${seconds}s`;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<h1 class="text-4xl font-bold mb-8 text-center">Cribbage Game Tracker</h1>

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading...</p>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			<p>{error}</p>
			<p class="text-sm mt-2">
				Make sure you've set up your Convex deployment and added the URL to .env.local
			</p>
		</div>
	{:else}
		<div class="mb-8 text-center">
			<a
				href="/auth"
				class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mr-4"
			>
				Login / Sign Up
			</a>
			<a
				href="/games/new"
				class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
			>
				Record New Game
			</a>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-8">
			<!-- Leaderboard -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-2xl font-bold mb-4">Leaderboard</h2>
				{#if leaderboard.length === 0}
					<p class="text-gray-600">No games recorded yet</p>
				{:else}
					<div class="space-y-2">
						{#each leaderboard as entry, i}
							<div class="flex items-center justify-between p-3 bg-gray-50 rounded">
								<div class="flex items-center gap-3">
									<span
										class="font-bold text-xl {i === 0
											? 'text-yellow-600'
											: i === 1
												? 'text-gray-500'
												: i === 2
													? 'text-orange-600'
													: 'text-gray-400'}"
									>
										#{i + 1}
									</span>
									<span class="font-semibold">{entry.player}</span>
								</div>
								<div class="text-right">
									<div class="font-bold text-green-600">{entry.wins} wins</div>
									<div class="text-sm text-gray-600">
										{entry.gamesPlayed} games ({entry.winRate}%)
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Recent Games -->
			<div class="bg-white rounded-lg shadow-md p-6">
				<h2 class="text-2xl font-bold mb-4">Recent Games</h2>
				{#if games.length === 0}
					<p class="text-gray-600">No games recorded yet</p>
				{:else}
					<div class="space-y-3">
						{#each games.slice(0, 5) as game}
							<div class="p-3 bg-gray-50 rounded">
								<div class="flex justify-between items-start mb-2">
									<div>
										<div class="font-semibold">Winner: {game.winner}</div>
										<div class="text-sm text-gray-600">
											Players: {game.players.join(', ')}
										</div>
									</div>
									<div class="text-right text-sm text-gray-600">
										<div>{formatDuration(game.duration)}</div>
									</div>
								</div>
								<div class="text-xs text-gray-500">{formatDate(game.startTime)}</div>
								<a
									href="/games/{game._id}"
									class="text-blue-600 hover:underline text-sm mt-2 inline-block"
								>
									View Details
								</a>
							</div>
						{/each}
					</div>
					{#if games.length > 5}
						<a href="/games" class="text-blue-600 hover:underline text-sm mt-4 inline-block">
							View all games →
						</a>
					{/if}
				{/if}
			</div>
		</div>

		<div class="text-center mt-8">
			<a href="/games" class="text-blue-600 hover:underline text-lg">View All Games</a>
		</div>
	{/if}
</div>
