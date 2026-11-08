<script>
	/**
	 * B7 — PF1 Finance, step 1 of 4.
	 * Step one asks only what comes in. Existing recurring entries are
	 * proposed, not copied silently, and this complete answer can be saved
	 * without committing to the remaining three questions.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Banner, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Finance 1 of 4 · Chief</title></svelte:head>

<Screen back="/records/plans/coverage" nav={false}>
	<Prog t="cool" title="What comes in" value={0.25} meta="Step 1 of 4 · income" />
	<Banner
		t="cool"
		title="Pre-filled from Money"
		meta="Recurring cash-in entries found. Confirm or change them."
	/>
	<Field label="Main revenue" placeholder="What customers pay for · $—" />
	<Field label="Other income" placeholder="Grants, services or one-offs · $—" />
	<Btn t="cool" href="/records/plans/finance/costs" label="Next: what goes out" />
	<Btn primary={false} href="/records/plans/coverage" label="Save and stop" />
</Screen>
