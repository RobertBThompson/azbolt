<script>
	/**
	 * B7 Business Plan — P1.
	 * The blank-page problem solved by removing the blank page. No section
	 * list is shown before there is content to put in it — a list of eleven
	 * empty sections is a demand, not a start.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Banner, Btn } from '$lib/kit';
</script>

<svelte:head><title>Business plan · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<Hero
		t="cool"
		title="Tell me about Azbolt"
		meta="Ninety seconds, out loud, in your own words. I will sort it into the standard sections."
	/>
	<Banner
		t="cool"
		title="You could start with"
		meta="What you sell, who buys it, and what is in the way."
	/>
	<Btn t="ai" href="/records/plans/braindump" label="Start talking" />
	<Btn primary={false} href="/records/plans/coverage" label="Type it instead" />
	<Btn primary={false} href="/records/plans/overview" label="See an existing plan" />
</Screen>
