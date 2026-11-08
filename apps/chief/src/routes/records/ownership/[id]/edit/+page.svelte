<script>
	/**
	 * B4 — R7 Edit ownership.
	 * Consequential fields are reviewed together before saving. Proof stays
	 * linked rather than re-uploaded, and changing a share never silently
	 * rewrites prior effective periods.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
</script>

<svelte:head><title>Edit ownership · Chief</title></svelte:head>

<Screen back="/records/ownership/{$page.params.id}" nav={false}>
	<Banner t="warm" title="TN Holdings owns Azbolt" meta="Edit the current ownership period." />
	<Field label="Share or control" value="100% · controlling interest" />
	<Row t="warm" title="Effective dates" meta="From 1 January · no end date" trailing="›" />
	<Row t="warm" title="Proof" meta="3 verified documents" trailing="↗" />
	<Row t="warm" title="Value visibility" meta="Private to this workspace" trailing="›" />
	<Btn t="warm" label="Review changes" />
</Screen>
