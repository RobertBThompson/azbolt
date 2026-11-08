<script>
	/**
	 * B5 Assets & Evidence — E2 Asset.
	 * The last row is the progressive disclosure that replaced v2's
	 * Attributes screen: six optional fields, collapsed, with their names
	 * visible so the user knows what is behind it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Chips, Row } from '$lib/kit';
	import { ASSETS } from '$lib/data.js';
	import { page } from '$app/stores';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id] ?? ASSETS['nfta-014']);
</script>

<svelte:head><title>{a.name} · Chief</title></svelte:head>

<Screen back="/records/assets" nav={false}>
	<Banner t="warm" title={a.name} meta={a.blurb} />
	<Chips t="warm" items={a.tags} active={-1} />
	<Row t="warm" title="Owner" meta={a.owner} trailing="↗" />
	<Row t="warm" href="/records/assets/{id}/proof" title="Claim" meta={a.claim} trailing="›" />
	<Row
		t="warm"
		href="/records/assets/{id}/valuation"
		title="Valuation"
		meta={a.valuation}
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/assets/{id}/details"
		title="Add detail"
		meta="Rights, period, liquidity — 6 optional fields"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/assets/{id}/timeline"
		title="Timeline"
		meta="Ownership and movement history"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/assets/{id}/movement"
		title="Movement"
		meta="Custody, not ownership"
		trailing="›"
	/>
</Screen>
