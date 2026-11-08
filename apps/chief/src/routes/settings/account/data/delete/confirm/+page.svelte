<script>
	/**
	 * B8 — G16 Confirm deletion.
	 * The irreversible action gets a second screen, an exact account label
	 * and typed confirmation. No default focus lands on Delete, and leaving
	 * this screen changes nothing.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Row, Btn } from '$lib/kit';

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
		title="Pamela Anderson · personal account"
		meta="All connected spheres and records in scope are listed before production release."
	/>
	<Field label="Type DELETE to confirm" placeholder="DELETE" bind:value={typed} />
	<Row title="Current account" meta="Pamela Anderson · signed in" trailing="✓" />
	<button class="danger" disabled={!armed}>Delete account and data</button>
	<Btn primary={false} href="/settings/account" label="Keep my account" />
</Screen>

<style>
	/* Rust, and only armed once the account name is typed. */
	.danger {
		height: var(--tap-min);
		border-radius: 11px;
		width: 100%;
		font-family: inherit;
		font-size: 14.5px;
		font-weight: 600;
		background: var(--tone-alert);
		border: 1px solid var(--tone-alert);
		color: #fff;
	}
	.danger:disabled {
		background: var(--card);
		border-color: var(--line-2);
		color: var(--ink-4);
		cursor: not-allowed;
	}
</style>
