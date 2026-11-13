<script>
	/**
	 * Assets — valuation.
	 * Every asset carries a value, because net worth is worked out from
	 * them. This is where that number comes from and how old it is.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Stats, Row, Btn, Alert } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS, events, short } from '$lib/assets.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id] ?? ASSETS['nfta-014']);
	const reviews = $derived(
		events(ASSETS[id] ? id : 'nfta-014').filter((e) => e.type === 'Re-valued')
	);
	const stale = $derived(a.valuedDaysAgo !== null && a.valuedDaysAgo > 365);
</script>

<svelte:head><title>Valuation · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="Valuation" />
	{#if a.value === null}
		<Alert title="No value recorded" meta="It is left out of net worth until it has one." />
	{:else if stale}
		<Alert
			title="This valuation is over a year old"
			meta="Net worth is still counting it as it was."
		/>
	{/if}
	<Stats
		items={[
			[short(a.value), 'Value'],
			[reviews[0]?.when ?? '—', 'Reviewed'],
			[String(reviews.length), reviews.length === 1 ? 'Review' : 'Reviews']
		]}
	/>
	{#each reviews as r (r.detail + r.when)}
		<Row t="warm" title={r.detail} meta="Re-valued" trailing={r.when} />
	{/each}
	<Btn t="warm" label="Update valuation" />
</Screen>
