<script>
	/**
	 * F2 Capture — Q3 AI split.
	 * The split is shown before the placements, so the user corrects the
	 * interpretation before arguing with the consequences.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Prog, Btn } from '$lib/kit';
</script>

<svelte:head><title>AI split · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Banner
		t="ai"
		title="2 separate things found"
		meta="One personal, one work. Split before placing."
	/>
	<Row t="ai" title="Call my daughter" meta="Personal follow-up" trailing="97%" />
	<Row t="ai" title="Talk to Carmen ASAP" meta="Azbolt work action" trailing="91%" />
	<Prog
		t="ai"
		title="Matching people, context and time"
		value={0.84}
		meta="Nothing has been created yet"
	/>
	<Btn t="ai" href="/jot/review" label="Review 4 placements" />
</Screen>
