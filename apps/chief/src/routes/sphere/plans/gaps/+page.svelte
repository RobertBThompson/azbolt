<script>
	/**
	 * B7 Business Plan — P5 Gaps.
	 * A queue of single questions, not a form. Two of the three can be
	 * answered by linking a record that already exists rather than typing.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Gaps · Chief</title></svelte:head>

<Screen back="/sphere/plans/coverage" nav={false}>
	<Banner t="ai" title="3 things still missing" meta="One question at a time. Answer or skip." />
	<Row
		t="ai"
		href="/sphere/plans/question"
		title="1 · Who else does this?"
		meta="Name two competitors"
		trailing="›"
	/>
	<Row
		t="ai"
		href="/records/money"
		title="2 · What does it cost you?"
		meta="Link Money instead of typing"
		trailing="↗"
	/>
	<Row
		t="ai"
		href="/sphere/plans/question"
		title="3 · What could go wrong?"
		meta="One sentence"
		trailing="›"
	/>
	<Btn t="ai" href="/sphere/plans/question" label="Answer the first one" />
	<Btn primary={false} href="/sphere/plans/export" label="Skip to the plan" />
</Screen>
