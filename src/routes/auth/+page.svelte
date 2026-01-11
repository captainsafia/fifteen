<script lang="ts">
	import { convex } from '$lib/convex';
	import { api } from '../../../convex/_generated/api';
	import { goto } from '$app/navigation';

	let mode = $state<'signin' | 'signup'>('signin');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state<string | null>(null);
	let loading = $state(false);

	async function handleSubmit() {
		error = null;
		loading = true;

		try {
			if (mode === 'signup') {
				await convex.mutation(api.auth.signIn, {
					provider: 'password',
					params: { email, password, name }
				});
			} else {
				await convex.mutation(api.auth.signIn, {
					provider: 'password',
					params: { email, password }
				});
			}

			// Redirect to home on success
			goto('/');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Authentication failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-md">
	<div class="bg-white rounded-lg shadow-md p-8">
		<h1 class="text-3xl font-bold mb-6 text-center">
			{mode === 'signin' ? 'Sign In' : 'Sign Up'}
		</h1>

		{#if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			{#if mode === 'signup'}
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
						Name
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					minlength="6"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
			>
				{loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
			</button>
		</form>

		<div class="mt-6 text-center">
			<button
				type="button"
				on:click={() => (mode = mode === 'signin' ? 'signup' : 'signin')}
				class="text-blue-600 hover:underline"
			>
				{mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
			</button>
		</div>

		<div class="mt-4 text-center">
			<a href="/" class="text-gray-600 hover:underline">← Back to home</a>
		</div>
	</div>
</div>
