<script>
	/**
	 * B5 — E6 Valuation.
	 * A valuation is a dated claim with a source, not a number overwritten
	 * in place. Prior reviews stay auditable.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Stats, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
</script>

<svelte:head><title>Valuation · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}" nav={false}>
	<Banner t="warm" title="NFTA artwork #014" meta="Current valuation · amount private" />
	<Stats
		items={[
			['$—', 'Value'],
			['3 Aug', 'Reviewed'],
			['1', 'Source']
		]}
	/>
	<Row t="warm" title="Method" meta="Independent appraisal" trailing="›" />
	<Row t="warm" title="Source" meta="Valuation review · verified" trailing="↗" />
	<Row t="warm" title="History" meta="2 prior valuations" trailing="›" />
	<Btn t="warm" label="Update valuation" />
</Screen>
