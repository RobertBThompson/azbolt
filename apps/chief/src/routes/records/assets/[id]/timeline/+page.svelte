<script>
	/**
	 * B5 Assets & Evidence — E5 Timeline.
	 * Ownership and movement changes stay auditable. This is also where an
	 * approved Quick Jot about an asset lands.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
</script>

<svelte:head><title>Timeline · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}" nav={false}>
	<Row t="warm" title="Created" meta="Artist identity captured" trailing="2026" />
	<Row t="warm" title="Token linked" meta="Ownership claim verified" trailing="2026" />
	<Row t="warm" title="Valuation updated" meta="Review document added" trailing="3 Aug" />
	<Row t="warm" title="Storage checked" meta="Facility confirmation" trailing="12 Aug" />
	<Btn t="ai" primary={false} href="/jot" label="Jot an update" />
</Screen>
