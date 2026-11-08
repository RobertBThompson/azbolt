<script>
	/**
	 * B8 — G15 Review deletion.
	 * The first destructive screen explains scope and offers export before
	 * proceeding. Retention exceptions are policy content that must be
	 * resolved explicitly; the wireframe refuses to invent them.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Row, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Review deletion · Chief</title></svelte:head>

<Screen back="/settings/account/data" nav={false}>
	<Alert
		title="Deletion is permanent"
		meta="Your account and Chief records will be scheduled for removal after final confirmation."
	/>
	<Row title="What will be deleted" meta="Account and branch records" trailing="›" />
	<Row title="Retention exceptions" meta="Show the approved legal policy here" trailing="›" />
	<Row
		href="/settings/account/data/export"
		title="Download first"
		meta="Prepare a data export"
		trailing="↗"
	/>
	<Field label="Reason · optional" placeholder="Tell us why you are leaving" />
	<Btn href="/settings/account/data/delete/confirm" label="Continue to confirmation" />
</Screen>
