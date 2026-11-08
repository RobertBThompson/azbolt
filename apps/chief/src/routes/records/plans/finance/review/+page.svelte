<script>
	/**
	 * B7 — PF4 Finance, step 4 of 4.
	 * The last step is a check, not another form. Revenue, cost and runway
	 * assumptions are visible together so a plausible-looking number cannot
	 * hide one wrong input.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Row, Alert, Btn } from '$lib/kit';
</script>

<svelte:head><title>Finance 4 of 4 · Chief</title></svelte:head>

<Screen back="/records/plans/finance/runway" nav={false}>
	<Prog t="cool" title="Does this look right?" value={1} meta="Step 4 of 4 · review" />
	<Row t="cool" title="Income" meta="Recurring and one-off assumptions" trailing="›" />
	<Row t="cool" title="Costs" meta="Recurring and planned assumptions" trailing="›" />
	<Row t="cool" title="Runway" meta="About 4.5 months · from current cash" trailing="›" />
	<Alert title="One assumption needs a source" meta="Other income has no linked record." />
	<Btn t="cool" href="/records/plans/overview" label="Save finance section" />
</Screen>
