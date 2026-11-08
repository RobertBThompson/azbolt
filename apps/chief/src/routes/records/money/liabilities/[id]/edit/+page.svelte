<script>
	/**
	 * B6 — M8 Edit liability.
	 * Editing keeps the same knowledge boundary as creation instead of
	 * flattening everything into one dense form. Changes are dated so prior
	 * balances and terms remain explainable.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Field, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';

	let active = $state(0);
</script>

<svelte:head><title>Edit liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities/{$page.params.id}" nav={false}>
	<Tabs items={['From memory', 'Paperwork']} {active} onpick={(i) => (active = i)} />
	<Field label="Balance" placeholder="Current amount left" />
	<Field label="Payment" placeholder="Amount and frequency" />
	<Field label="Interest rate" placeholder="I don't know yet" />
	<Row
		t="warm"
		href="/records/assets"
		title="Secured asset"
		meta="Linked asset record"
		trailing="↗"
	/>
	<Btn t="warm" label="Save changes" />
</Screen>
