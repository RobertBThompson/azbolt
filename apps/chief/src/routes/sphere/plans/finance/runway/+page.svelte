<script>
	/**
	 * B7 — PF3 Finance, step 3 of 4.
	 * The third seam is where income and cost assumptions become runway.
	 * Chief shows the calculated result and its source inputs, but cash
	 * available stays directly editable because it can change outside
	 * recorded entries.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Banner, Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Finance 3 of 4 · Chief</title></svelte:head>

<Screen back="/sphere/plans/finance/costs" nav={false}>
	<Prog t="cool" title="How long it lasts" value={0.75} meta="Step 3 of 4 · cash and runway" />
	<Banner
		t="cool"
		title="Calculated from steps 1 and 2"
		meta="Change an input here or return to the earlier answer."
	/>
	<Field label="Cash available" placeholder="Current usable cash · $—" />
	<Row t="cool" title="Estimated runway" meta="About 4.5 months" trailing="›" />
	<Btn t="cool" href="/sphere/plans/finance/review" label="Next: review assumptions" />
	<Btn primary={false} href="/sphere/plans/coverage" label="Save and stop" />
</Screen>
