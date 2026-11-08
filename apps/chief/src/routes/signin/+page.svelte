<script>
	/**
	 * F0 Shell — sign in.
	 *
	 * Deliberately not a gate. Chief's 97 screens are still a design
	 * prototype people need to walk through, and putting a login in front
	 * of them would make the app less useful than it is today. Signing in
	 * is what turns the Directory from placeholders into records; every
	 * other screen behaves the same either way.
	 *
	 * Sign up and sign in share one form because this is a single-user
	 * install in practice — the difference is one request, not one screen.
	 */
	import { goto } from '$app/navigation';
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Btn, Field, Note, Seg } from '$lib/kit';
	import { session } from '$lib/session.svelte.js';
	import { backendUp } from '$lib/pb.js';

	/** 0 = sign in, 1 = create account. Seg speaks in indexes. */
	let mode = $state(0);
	let email = $state('');
	let password = $state('');

	const creating = $derived(mode === 1);
	const ready = $derived(email.trim().length > 0 && password.length > 0 && !session.busy);

	const reachable = backendUp();

	async function submit() {
		if (!ready) return;
		const ok = creating
			? await session.signUp(email.trim(), password)
			: await session.signIn(email.trim(), password);
		if (ok) goto('/people');
	}
</script>

<svelte:head><title>Sign in · Chief</title></svelte:head>

<Screen back="/menu" nav={false}>
	{#if session.signedIn}
		<Banner title="Signed in" meta={session.label} />
		<Note>Your Directory reads your own records. Everything else is still design data.</Note>
		<Btn t="cool" href="/people" label="Open Directory" />
		<Btn primary={false} label="Sign out" onclick={() => session.signOut()} />
	{:else}
		{#await reachable then up}
			{#if !up}
				<Alert
					title="No backend reachable"
					meta="Chief is running on design placeholders. Signing in needs PocketBase to answer at /api."
				/>
			{/if}
		{/await}

		<Banner title="Chief" meta="Sign in to keep your own records." />
		<Seg a="Sign in" b="Create account" t="cool" bind:active={mode} />

		<form
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<Field
				label="Email"
				type="email"
				placeholder="you@example.com"
				disabled={session.busy}
				bind:value={email}
			/>
			<Field
				label="Password"
				type="password"
				autocomplete={creating ? 'new-password' : 'current-password'}
				placeholder={creating ? 'At least 8 characters' : ''}
				disabled={session.busy}
				bind:value={password}
			/>

			{#if session.error}
				<Alert title="Not signed in" meta={session.error} />
			{/if}

			<Btn
				t="cool"
				type="submit"
				disabled={!ready}
				label={session.busy ? 'Working…' : creating ? 'Create account' : 'Sign in'}
			/>
		</form>

		<Note>
			Records are scoped to the account that created them, so nothing you add here is visible to
			another sign-in.
		</Note>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
</style>
