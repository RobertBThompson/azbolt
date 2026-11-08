<script>
	/**
	 * B6 Money — M5 Add · from memory.
	 * Where a real form survives, the seam is placed at a change of
	 * knowledge. Step one asks only what someone can answer standing up.
	 * "Approximate is fine" is doing real work: the alternative to an
	 * approximate balance is no record at all.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Add liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities" nav={false}>
	<Prog t="warm" title="From memory" value={0.5} meta="Step 1 of 2 · what you already know" />
	<Field label="What kind" placeholder="Loan, lease, credit line" />
	<Field label="Who to" placeholder="Person or organisation" />
	<Field label="How much is left" placeholder="Approximate is fine" />
	<Btn t="warm" href="/records/money/liabilities/new/paperwork" label="Next: the paperwork" />
</Screen>
