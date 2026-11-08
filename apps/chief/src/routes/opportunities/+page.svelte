<script>
	/**
	 * B2 Today — T2 Opportunities.
	 * Suggestions with their evidence attached, never automations. Same
	 * approval posture as Quick Jot: Chief noticed, Chief did not act.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Note } from '$lib/kit';
</script>

<svelte:head><title>Opportunities · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Banner
		t="cool"
		title="3 things Chief noticed"
		meta="Patterns across records you already have."
	/>
	<Row
		t="cool"
		href="/opportunities/idle-equipment"
		title="Idle equipment"
		meta="18 items unused since March; Build pilot needs 4"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/opportunities/carmen-idle"
		title="Carmen has no next action"
		meta="Shared endeavor has been still for 9 days"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/opportunities/invoice"
		title="Invoice due Friday"
		meta="Azbolt · not matched to any cash entry"
		trailing="›"
	/>
	<Note>Dismissing one tells Chief why, and that reason is visible in placement rules.</Note>
</Screen>
