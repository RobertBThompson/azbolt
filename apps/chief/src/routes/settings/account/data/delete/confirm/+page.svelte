<script>
	/**
	 * B8 — G16 Confirm deletion.
	 * The irreversible action gets a second screen, an exact account label
	 * and typed confirmation. No default focus lands on Delete, and leaving
	 * this screen changes nothing.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Row, Btn } from '$lib/kit';
	import { session } from '$lib/session.svelte.js';

	let typed = $state('');
	const armed = $derived(typed.trim().toUpperCase() === 'DELETE');
</script>

<svelte:head><title>Confirm deletion · Chief</title></svelte:head>

<Screen back="/settings/account/data/delete" nav={false}>
	<Alert
		title="This cannot be undone"
		meta="Confirm the account below. Export first if you need a copy."
	/>
	<Banner
		title={session.signedIn ? session.label : 'Not signed in'}
		meta="Deleting is not built yet. Nothing on this screen can remove anything."
	/>
	<Field label="Type DELETE to confirm" placeholder="DELETE" bind:value={typed} />
	{#if session.signedIn}
		<Row title="Current account" meta={session.user?.email ?? ''} />
	{/if}
	<button class="danger" disabled={!armed || true}>Delete account and data</button>
	<Btn primary={false} href="/settings/account" label="Keep my account" />
</Screen>

<style>
	/* Rust, and only armed once the account name is typed. */
	.danger {
		height: var(--tap-min);
		border-radius: 999px;
		width: 100%;
		font-family: var(--font-display);
		font-size: 16.5px;
		font-weight: 700;
		background:
			var(--gloss),
			linear-gradient(
				118deg,
				color-mix(in srgb, var(--tone-alert) 80%, #ffffff) 0%,
				var(--tone-alert) 50%,
				#5c1f3a 100%
			);
		border: 1px solid color-mix(in srgb, var(--tone-alert) 70%, #ffffff);
		color: #fff;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 12px 22px -10px var(--tone-alert);
		cursor: pointer;
	}
	.danger:disabled {
		background: var(--glass-dim);
		border-color: rgba(255, 255, 255, 0.6);
		color: var(--ink-3);
		cursor: not-allowed;
		box-shadow: none;
	}
</style>
