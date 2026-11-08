<script>
	/**
	 * B8 — G12 Data controls.
	 * Export and deletion share a discoverable entry point but immediately
	 * separate. The safe, reversible action is listed first; deletion never
	 * borrows the same button treatment or copy.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Note, Btn } from '$lib/kit';
</script>

<svelte:head><title>Data controls · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	<Banner
		title="Your data, your choice"
		meta="Download a copy or permanently remove this account and its records."
	/>
	<Row
		href="/settings/account/data/export"
		title="Export a copy"
		meta="Choose branches and file types"
		trailing="›"
	/>
	<Row
		href="/settings/account/data/delete"
		title="Delete account and data"
		meta="Review impact before confirming"
		trailing="›"
	/>
	<Note>Exporting changes nothing. Deletion cannot be undone after final confirmation.</Note>
	<Btn primary={false} href="/settings/account" label="Back to Account & legal" />
</Screen>
