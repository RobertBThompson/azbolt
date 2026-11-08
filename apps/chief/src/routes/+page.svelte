<script>
	/**
	 * B2 Today — T1.
	 *
	 * Attention first, then today's two commitments, then the counts.
	 *
	 * The date leads in serif at a size nothing else on the screen uses.
	 * Every other Chief screen is a list of records; this one is a moment
	 * in time, and it should not open looking like the others.
	 *
	 * There is no Quick Jot button here any more. Capture is the mark in
	 * the nav, reachable from every screen — a second entry point on this
	 * screen alone would teach that it is a Today feature.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Stats } from '$lib/kit';

	const now = new Date();
	const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
	const date = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
</script>

<svelte:head><title>Today · Chief</title></svelte:head>

<Screen>
	<header class="day">
		<p class="eyebrow">{weekday}</p>
		<h1>{date}</h1>
	</header>

	<!-- Violet: the waiting-placement banner is the only AI moment here. -->
	<Banner t="ai" title="2 placements waiting" meta="From your 6:12 PM jot. Nothing created yet." />

	<Row
		t="cool"
		href="/work/tasks/carmen"
		title="Talk to Carmen"
		meta="Azbolt · today 3:30 PM"
		trailing="›"
	/>
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

	<Row
		t="cool"
		href="/opportunities"
		title="3 things Chief noticed"
		meta="Patterns across records you already have"
		trailing="›"
	/>
</Screen>

<style>
	.day {
		padding: 2px 2px 4px;
	}
	.day h1 {
		margin: 1px 0 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 29px;
		line-height: 1.1;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
</style>
