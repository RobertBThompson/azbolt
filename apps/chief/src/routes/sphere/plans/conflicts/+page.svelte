<script>
	/**
	 * B7 — PS2 Business plan, sources disagree.
	 * Chief flags conflicting or stale sources instead of silently
	 * redrafting. The rest stays readable and exportable; only the affected
	 * claims are held for review.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Row, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Needs review · Chief</title></svelte:head>

<Screen back="/sphere/plans/overview" nav={false}>
	<Alert title="2 sections need review" meta="A source changed after these drafts were accepted." />
	<Row
		t="cool"
		href="/sphere/plans/section"
		title="Market"
		meta="Your braindump and a linked note disagree"
		trailing="Review"
	/>
	<Row
		t="cool"
		href="/sphere/plans/finance/review"
		title="Finance"
		meta="Money data is newer than this section"
		trailing="Review"
	/>
	<Row t="cool" title="Team" meta="Strong · Directory is current" trailing="›" />
	<Btn t="cool" href="/sphere/plans/section" label="Review the first flag" />
	<Note>No accepted sentence is rewritten until you approve the change.</Note>
</Screen>
