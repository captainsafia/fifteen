<script lang="ts">
	import { onMount } from 'svelte';
	import { convex } from '$lib/convex';
	import { api } from '../../../convex/_generated/api';

	let games = $state<any[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const unsubscribe = convex.onUpdate(api.queries.listGames, {}, (newGames) => {
				games = newGames;
				loading = false;
			});

			return unsubscribe;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load games';
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

	async function deleteGame(id: string) {
		if (!confirm('Are you sure you want to delete this game?')) {
			return;
		}

		try {
			await convex.mutation(api.games.deleteGame, { id: id as any });
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Failed to delete game');
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-4xl font-bold">All Games</h1>
		<a
			href="/games/new"
			class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
		>
			Record New Game
		</a>
	</div>

	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading games...</p>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			{error}
		</div>
	{:else if games.length === 0}
		<div class="bg-gray-100 rounded-lg p-8 text-center">
			<p class="text-gray-600 text-lg mb-4">No games recorded yet</p>
			<a
				href="/games/new"
				class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
			>
				Record Your First Game
			</a>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow-md overflow-hidden">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Winner</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Players</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each games as game}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm text-gray-600">
								{formatDate(game.startTime)}
							</td>
							<td class="px-6 py-4">
								<span class="font-semibold text-green-600">{game.winner}</span>
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{game.players.join(', ')}
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{formatDuration(game.duration)}
							</td>
							<td class="px-6 py-4 text-sm">
								<div class="flex gap-2">
									<a
										href="/games/{game._id}"
										class="text-blue-600 hover:underline"
									>
										View
									</a>
									<a
										href="/games/{game._id}/edit"
										class="text-yellow-600 hover:underline"
									>
										Edit
									</a>
									<button
										type="button"
										on:click={() => deleteGame(game._id)}
										class="text-red-600 hover:underline"
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<div class="mt-8 text-center">
		<a href="/" class="text-blue-600 hover:underline">← Back to home</a>
	</div>
</div>
