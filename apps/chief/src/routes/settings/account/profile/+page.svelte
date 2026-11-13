<script>
	/**
	 * B8 — G8 Profile & sign-in.
	 * Identity and access live together because a name change is routine
	 * while a sign-in change affects recovery. Active sessions stay visible
	 * rather than hidden behind a security label.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Row, Btn } from '$lib/kit';
	import { session } from '$lib/session.svelte.js';

	/* This screen showed a sample person's name to whoever was signed in,
	   which is the one place a wrong name is unmistakably a bug. */
	let name = $state(session.label);
</script>

<svelte:head><title>Profile & sign-in · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	{#if session.signedIn}
		<Banner title={session.label} meta={session.user?.email ?? 'Signed in'} />
		<Field label="Display name" bind:value={name} />
		<Btn label="Save profile" soon />
	{:else}
		<Banner title="Not signed in" meta="Sign in to see and change your profile." />
		<Btn href="/signin" label="Sign in" />
	{/if}
</Screen>
