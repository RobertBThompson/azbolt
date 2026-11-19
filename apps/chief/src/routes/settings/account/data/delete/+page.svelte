<script>
	/**
	 * B8 — G15 Review deletion.
	 * The first destructive screen says exactly what goes, and offers the
	 * copy before going on.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Row, Btn, Note } from '$lib/kit';
	import { session } from '$lib/session.svelte.js';
</script>

<svelte:head><title>Review deletion · Chief</title></svelte:head>

<Screen back="/settings/account/data" nav={false}>
	<Alert
		title="Deletion is permanent"
		meta="Your account and every record under it are removed from the server. There is no undo and no waiting period."
	/>
	<Row
		title="What is deleted"
		meta="Spheres, people, organizations, jots, assets and their values, ownership, liabilities, cash, tasks and endeavors — and the sign-in itself"
	/>
	<Row
		title="What is not"
		meta="Notes and documents on this device, and any backup the server's keeper has already taken"
	/>
	<Row
		href="/settings/account/data/export"
		title="Download a copy first"
		meta="One file with everything"
		trailing="↗"
	/>
	{#if session.signedIn}
		<Btn href="/settings/account/data/delete/confirm" label="Continue to confirmation" />
	{:else}
		<Note>You are not signed in, so there is no account here to delete.</Note>
		<Btn href="/signin" label="Sign in" />
	{/if}
</Screen>
