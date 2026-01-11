<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { convex } from '$lib/convex';
	import { api } from '../../../../../convex/_generated/api';

	let game = $state<any>(null);
	let loading = $state(true);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let gameId = $derived($page.params.id);

	let players = $state<string[]>([]);
	let winner = $state('');
	let points = $state<Record<string, string>>({});
	let startTime = $state('');
	let endTime = $state('');

	onMount(async () => {
		try {
			const unsubscribe = convex.onUpdate(
				api.queries.getGame,
				{ id: gameId as any },
				(newGame) => {
					if (newGame) {
						game = newGame;
						players = [...newGame.players];
						winner = newGame.winner;
						points = Object.fromEntries(
							Object.entries(newGame.points).map(([k, v]) => [k, String(v)])
						);
						startTime = new Date(newGame.startTime).toISOString().slice(0, 16);
						endTime = new Date(newGame.endTime).toISOString().slice(0, 16);
					}
					loading = false;
				}
			);

			return unsubscribe;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load game';
			loading = false;
		}
	});

	function addPlayer() {
		if (players.length < 4) {
			players = [...players, ''];
		}
	}

	function removePlayer(index: number) {
		if (players.length > 2) {
			players = players.filter((_, i) => i !== index);
		}
	}

	async function handleSubmit() {
		error = null;

		// Validate players
		const validPlayers = players.filter((p) => p.trim() !== '');
		if (validPlayers.length < 2) {
			error = 'At least 2 players are required';
			return;
		}

		if (!winner || !validPlayers.includes(winner)) {
			error = 'Please select a winner from the players';
			return;
		}

		// Convert points to numbers
		const pointsObj: Record<string, number> = {};
		for (const player of validPlayers) {
			const pointValue = points[player] || '0';
			pointsObj[player] = parseInt(pointValue) || 0;
		}

		saving = true;

		try {
			const startMs = new Date(startTime).getTime();
			const endMs = new Date(endTime).getTime();

			await convex.mutation(api.games.updateGame, {
				id: gameId as any,
				players: validPlayers,
				winner,
				points: pointsObj as any,
				startTime: startMs,
				endTime: endMs
			});

			goto(`/games/${gameId}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to update game';
			saving = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	{#if loading}
		<div class="text-center py-8">
			<p class="text-gray-600">Loading game...</p>
		</div>
	{:else if !game}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			Game not found
		</div>
		<div class="mt-4">
			<a href="/games" class="text-blue-600 hover:underline">← Back to games</a>
		</div>
	{:else}
		<h1 class="text-4xl font-bold mb-8">Edit Game</h1>

		{#if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow-md p-6 space-y-6">
			<!-- Players -->
			<div>
				<div class="flex justify-between items-center mb-3">
					<label class="block text-lg font-semibold text-gray-700">Players</label>
					{#if players.length < 4}
						<button
							type="button"
							on:click={addPlayer}
							class="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
						>
							Add Player
						</button>
					{/if}
				</div>

				<div class="space-y-2">
					{#each players as player, i}
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={players[i]}
								placeholder="Player {i + 1} name"
								required
								class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							{#if players.length > 2}
								<button
									type="button"
									on:click={() => removePlayer(i)}
									class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
								>
									Remove
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Winner -->
			<div>
				<label for="winner" class="block text-lg font-semibold text-gray-700 mb-2">Winner</label>
				<select
					id="winner"
					bind:value={winner}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select winner...</option>
					{#each players.filter((p) => p.trim() !== '') as player}
						<option value={player}>{player}</option>
					{/each}
				</select>
			</div>

			<!-- Points -->
			<div>
				<label class="block text-lg font-semibold text-gray-700 mb-2">Points Scored</label>
				<div class="space-y-2">
					{#each players.filter((p) => p.trim() !== '') as player}
						<div class="flex items-center gap-3">
							<label for="points-{player}" class="w-32 text-gray-700">{player}:</label>
							<input
								id="points-{player}"
								type="number"
								bind:value={points[player]}
								min="0"
								placeholder="0"
								class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					{/each}
				</div>
			</div>

			<!-- Start Time -->
			<div>
				<label for="startTime" class="block text-lg font-semibold text-gray-700 mb-2">
					Start Time
				</label>
				<input
					id="startTime"
					type="datetime-local"
					bind:value={startTime}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- End Time -->
			<div>
				<label for="endTime" class="block text-lg font-semibold text-gray-700 mb-2">
					End Time
				</label>
				<input
					id="endTime"
					type="datetime-local"
					bind:value={endTime}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- Submit Button -->
			<div class="flex gap-4">
				<button
					type="submit"
					disabled={saving}
					class="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50 font-semibold"
				>
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
				<a
					href="/games/{gameId}"
					class="flex-1 bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition text-center font-semibold"
				>
					Cancel
				</a>
			</div>
		</form>
	{/if}
</div>
