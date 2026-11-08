<script>
	/**
	 * B5 — E7 Asset details.
	 * The progressive disclosure that replaced v2's Attributes screen. The
	 * fields are grouped by the question that makes them useful, and every
	 * field remains optional.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Tabs, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';

	let active = $state(0);
</script>

<svelte:head><title>Asset details · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}" nav={false}>
	<Banner
		t="warm"
		title="Optional until it matters"
		meta="Add only the detail needed for a decision or a proof record."
	/>
	<Tabs items={['Rights', 'Physical', 'Financial']} {active} onpick={(i) => (active = i)} />
	<Row t="warm" title="Rights" meta="Creator, licence, reproduction" trailing="›" />
	<Row t="warm" title="Physical" meta="Dimensions, condition, storage" trailing="›" />
	<Row t="warm" title="Financial" meta="Liquidity, insurance, tax notes" trailing="›" />
	<Btn t="warm" label="Save details" />
</Screen>
