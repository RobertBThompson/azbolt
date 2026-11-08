<script>
	/**
	 * B6 Money — M4 Liabilities.
	 * Each described by impact and timing rather than by product type.
	 * Timing is what makes the row worth reading.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Stats, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Liabilities · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	<Stats
		items={[
			['$—', 'Balance'],
			['$—', 'Monthly'],
			['2', 'Active']
		]}
	/>
	<Row
		t="warm"
		href="/records/money/liabilities/loan"
		title="Business loan"
		meta="Azbolt · monthly · due Friday"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/money/liabilities/lease"
		title="Equipment lease"
		meta="Build · quarterly"
		trailing="›"
	/>
	<Btn t="warm" href="/records/money/liabilities/new" label="Add a liability" />
</Screen>
