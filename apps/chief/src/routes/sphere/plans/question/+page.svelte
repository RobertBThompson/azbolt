<script>
	/**
	 * B7 — P8 Plan question.
	 * A gap opens as one bounded question rather than the old section
	 * editor. Linking evidence is optional, and saving returns to coverage
	 * so the user sees exactly what the answer changed.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Plan question · Chief</title></svelte:head>

<Screen back="/sphere/plans/gaps" nav={false}>
	<Banner
		t="ai"
		title="Who else does this?"
		meta="Name two alternatives a customer might choose instead."
	/>
	<Field
		label="Your answer"
		placeholder="They use spreadsheets, dispatch software, or do it by phone…"
	/>
	<Row t="ai" title="Use as evidence" meta="Link a note or record · optional" trailing="↗" />
	<Row t="ai" title="Updates" meta="Market · competition" trailing="1 section" />
	<Btn t="ai" href="/sphere/plans/coverage" label="Save answer" />
	<Btn primary={false} href="/sphere/plans/gaps" label="Skip for now" />
</Screen>
