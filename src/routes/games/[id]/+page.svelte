<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { convex } from '$lib/convex';
	import { api } from '../../../../convex/_generated/api';

	let game = $state<any>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let gameId = $derived($page.params.id);

	onMount(() => {
		try {
			const unsubscribe = convex.onUpdate(
				api.queries.getGame,
				{ id: gameId as any },
				(newGame) => {
					game = newGame;
					loading = false;
				}
			);

			return unsubscribe;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load game';
			loading = false;
		}
	});

	function formatDuration(ms: number): string {
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		
		if (hours > 0) {
			return `${hours}h ${minutes}m ${seconds}s`;
		}
		return `${minutes}m ${seconds}s`;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}

	async function deleteGame() {
		if (!confirm('Are you sure you want to delete this game?')) {
			return;
		}

		try {
			await convex.mutation(api.games.deleteGame, { id: gameId as any });
			window.location.href = '/games';
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Failed to delete game');
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading game details...</p>
		</div>
	{:else if error || !game}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			{error || 'Game not found'}
		</div>
		<div class="mt-4">
			<a href="/games" class="text-blue-600 hover:underline">← Back to games</a>
		</div>
	{:else}
		<div class="mb-6">
			<a href="/games" class="text-blue-600 hover:underline">← Back to games</a>
		</div>

		<div class="bg-white rounded-lg shadow-md p-8">
			<div class="flex justify-between items-start mb-6">
				<h1 class="text-3xl font-bold">Game Details</h1>
				<div class="flex gap-2">
					<a
						href="/games/{gameId}/edit"
						class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
					>
						Edit
					</a>
					<button
						type="button"
						onclick={deleteGame}
						class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
					>
						Delete
					</button>
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-6 mb-6">
				<!-- Winner -->
				<div class="bg-green-50 rounded-lg p-4 border-2 border-green-200">
					<h2 class="text-sm font-semibold text-green-700 mb-2">Winner</h2>
					<p class="text-2xl font-bold text-green-600">{game.winner}</p>
				</div>

				<!-- Duration -->
				<div class="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
					<h2 class="text-sm font-semibold text-blue-700 mb-2">Duration</h2>
					<p class="text-2xl font-bold text-blue-600">{formatDuration(game.duration)}</p>
				</div>
			</div>

			<!-- Players & Points -->
			<div class="mb-6">
				<h2 class="text-xl font-semibold mb-3">Players & Points</h2>
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="space-y-2">
						{#each game.players as player}
							<div class="flex justify-between items-center p-3 bg-white rounded {player === game.winner ? 'border-2 border-green-400' : ''}">
								<span class="font-semibold">
									{player}
									{#if player === game.winner}
										<span class="text-green-600 ml-2">👑</span>
									{/if}
								</span>
								<span class="text-lg font-bold text-gray-700">
									{game.points[player] || 0} points
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Time Details -->
			<div class="grid md:grid-cols-2 gap-6">
				<div>
					<h2 class="text-xl font-semibold mb-3">Start Time</h2>
					<p class="text-gray-700">{formatDate(game.startTime)}</p>
				</div>
				<div>
					<h2 class="text-xl font-semibold mb-3">End Time</h2>
					<p class="text-gray-700">{formatDate(game.endTime)}</p>
				</div>
			</div>
		</div>
	{/if}
</div>
