<script>
	/**
	 * B7 — P6 Finance, step 2 of 4.
	 * Four fields maximum, pre-filled from Money, and "save and stop" on
	 * every step. Each step answers one question, so partial completion is
	 * still worth something.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Banner, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Finance 2 of 4 · Chief</title></svelte:head>

<Screen back="/records/plans/finance/income" nav={false}>
	<Prog t="cool" title="What goes out" value={0.5} meta="Step 2 of 4 · costs" />
	<Banner
		t="cool"
		title="Pre-filled from Money"
		meta="3 recurring costs found. Change them or add more."
	/>
	<Field label="Largest cost" placeholder="Salaries · $—" />
	<Field label="Second largest" placeholder="Software · $—" />
	<Btn t="cool" href="/records/plans/finance/runway" label="Next: how long it lasts" />
	<Btn primary={false} href="/records/plans/coverage" label="Save and stop" />
</Screen>
