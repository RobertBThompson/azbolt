<script>
	/**
	 * B5 Assets & Evidence — E4 Claims & files.
	 * Proof is a first-class surface, not an attachments tab at the bottom of
	 * a form. Five kinds, each with a status rather than a filename — an
	 * empty slot is as informative as a full one.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
</script>

<svelte:head><title>Claims & files · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}" nav={false}>
	<Row t="warm" title="Ownership token" meta="Verified · wallet linked" trailing="✓" />
	<Row t="warm" title="Title / provenance" meta="2 documents" trailing="✓" />
	<Row
		t="warm"
		href="/records/assets/{$page.params.id}/proof/record"
		title="Storage record"
		meta="Secure facility"
		trailing="✓"
	/>
	<Row t="warm" title="Insurance" meta="Active policy" trailing="✓" />
	<Row t="warm" title="Movement authorisation" meta="None open" trailing="—" />
	<Btn t="warm" href="/records/assets/{$page.params.id}/proof/new" label="Add proof" />
</Screen>
