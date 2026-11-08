<script>
	/**
	 * F2 Capture — Q13 Placement rule.
	 * A learned rule is inspectable and removable as a record, not just an
	 * unexplained toggle. Its source correction and use history are what
	 * make the learning auditable.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Placement rule · Chief</title></svelte:head>

<Screen back="/jot/rules" nav={false}>
	<Banner t="ai" title="Carmen → Azbolt work" meta="Created from a correction you approved." />
	<Row t="ai" title="When it applies" meta="“Carmen” during work hours" trailing="›" />
	<Row t="ai" title="Proposed placement" meta="Azbolt · work task" trailing="›" />
	<Row t="ai" title="Source correction" meta="Approved 12 August" trailing="›" />
	<Row t="ai" title="Used" meta="4 proposals · last used today" trailing="›" />
	<Btn primary={false} href="/jot/rules" label="Delete this rule" />
</Screen>
