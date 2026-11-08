<script>
	/**
	 * B7 Business Plan — P3 Coverage.
	 * The replacement for "72% complete", which measured how much of a form
	 * was filled rather than whether the plan was any good. Coverage plus
	 * confidence, per section: a section can be short and strong, or long
	 * and flagged.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Coverage · Chief</title></svelte:head>

<Screen back="/records/plans" nav={false}>
	<Banner
		t="ai"
		title="I could fill 6 of 11 sections"
		meta="From what you said, plus records already in Chief."
	/>
	<Row
		t="ai"
		href="/records/plans/section"
		title="Purpose & offer"
		meta="Strong · from your words"
		trailing="●●●"
	/>
	<Row
		t="ai"
		href="/records/plans/section"
		title="Market"
		meta="Thin · one sentence"
		trailing="●○○"
	/>
	<Row t="ai" title="Team" meta="Strong · from Directory" trailing="●●●" />
	<Row
		t="ai"
		href="/records/plans/finance/income"
		title="Finance"
		meta="Nothing yet · needs numbers"
		trailing="○○○"
	/>
	<Btn t="ai" href="/records/plans/section" label="Review the drafts" />
</Screen>
