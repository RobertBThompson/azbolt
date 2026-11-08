<script>
	/**
	 * B4 Structure & Ownership — R4 Ownership record.
	 * The stat trio is the screen most at risk for screen readers: read
	 * naively it says "Control, Role, 100%, Share" — meaningless. Stats
	 * announce label first. Value is private by default; a number this
	 * sensitive should be opt-in to display.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Stats, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
</script>

<svelte:head><title>Ownership record · Chief</title></svelte:head>

<Screen back="/records/ownership" nav={false}>
	<Banner t="warm" title="TN Holdings owns Azbolt" meta="Controlling interest since 1 January." />
	<Stats
		items={[
			['Control', 'Role'],
			['100%', 'Share'],
			['Active', 'Status']
		]}
	/>
	<Row t="warm" title="Proof" meta="3 verified documents" trailing="›" />
	<Row t="warm" title="Effective dates" meta="From 1 Jan · no end date" trailing="›" />
	<Row t="warm" title="Value" meta="Private to this sphere" trailing="›" />
	<Btn t="warm" href="/records/ownership/{$page.params.id}/edit" label="Edit this record" />
</Screen>
