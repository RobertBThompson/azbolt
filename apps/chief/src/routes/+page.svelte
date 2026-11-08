<script>
	/**
	 * B2 Today — T1.
	 * Attention first, then today's two commitments, then the counts.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Stats, Btn } from '$lib/kit';
</script>

<svelte:head><title>Today · Chief</title></svelte:head>

<Screen>
	<!-- Teal: the waiting-placement banner is the only AI moment on this screen. -->
	<Banner t="ai" title="2 placements waiting" meta="From your 6:12 PM jot. Nothing created yet." />

	<Row t="cool" href="/work" title="Talk to Carmen" meta="Azbolt · today 3:30 PM" trailing="›" />
	<Row
		t="cool"
		href="/work"
		title="Call my daughter"
		meta="Personal · tonight 7:00 PM"
		trailing="›"
	/>

	<Stats
		items={[
			['3', 'Needs you'],
			['5', 'On track'],
			['1', 'Overdue']
		]}
	/>

	<Btn t="ai" primary={false} href="/jot" label="Quick Jot" />
</Screen>
