<script>
	/**
	 * B7 — PS1 Business plan, populated.
	 * Still measures coverage rather than compliance: it leads with the next
	 * unanswered question and keeps strong, thin and missing sections
	 * distinguishable instead of collapsing them into one percentage.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Business plan · Chief</title></svelte:head>

<Screen back="/sphere" nav={false}>
	<Banner
		t="cool"
		title="Azbolt · 9 of 11 sections covered"
		meta="Two useful gaps remain; nothing is marked complete by word count."
	/>
	<Row
		t="cool"
		href="/sphere/plans/coverage"
		title="Strong"
		meta="Purpose, offer, team · 6 sections"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/sphere/plans/coverage"
		title="Thin"
		meta="Market, risks · 3 sections"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/sphere/plans/gaps"
		title="Missing"
		meta="Competition, milestones · 2 sections"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/sphere/plans/conflicts"
		title="Needs review"
		meta="2 sections · a source changed"
		trailing="›"
	/>
	<Btn t="cool" href="/sphere/plans/question" label="Continue with the next gap" />
	<Btn primary={false} href="/sphere/plans/export" label="Export this draft" />
</Screen>
