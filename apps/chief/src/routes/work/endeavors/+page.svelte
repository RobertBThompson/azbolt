<script>
	/**
	 * B3 Work — W1 Endeavors.
	 * Each row carries the next action, not just a percentage. A list of
	 * progress bars tells you nothing you can act on.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Banner, Tabs, Row, Seg, Alert, Btn, Note } from '$lib/kit';
	import { page } from '$app/stores';

	let active = $state(0);
	let keep = $state(0);
	const view = $derived($page.url.searchParams.get('state') ?? 'default');
</script>

<svelte:head><title>Endeavors · Chief</title></svelte:head>

<Screen back="/work" nav={false}>
	{#if view === 'empty'}
		<!-- The empty state is the glossary: this is where the word
		     "endeavor" is finally introduced, with right and wrong phrasing. -->
		<Hero
			t="cool"
			title="No endeavors yet"
			meta="An endeavor is a thing you want to be true — “the site is live”, not “website”."
		/>
		<Banner t="cool" title="Good" meta="“Customers can buy without emailing us”" />
		<Btn t="cool" href="/work/endeavors/new" label="Name one outcome" />
		<Btn primary={false} href="/work/endeavors" label="See an example" />
	{:else if view === 'conflict'}
		<!-- A conflict is a choice, not an error dialog. One bad row does
		     not lock the screen. -->
		<Alert
			title="One endeavor is out of sync"
			meta="“Build pilot” changed on another device while you were offline."
		/>
		<Row
			t="cool"
			title="Build pilot"
			meta="Two versions · edited 4 hours apart"
			trailing="Review"
		/>
		<Seg t="cool" a="Keep mine" b="Keep theirs" bind:active={keep} />
		<Row
			t="cool"
			href="/work/endeavors/website"
			title="Website launch"
			meta="68% · next: approve homepage"
			trailing="›"
		/>
		<Note>Nothing is overwritten until you choose. Both versions stay in placement history.</Note>
	{:else}
		<Tabs items={['Active', 'Planned', 'Done']} {active} onpick={(i) => (active = i)} />
		<Row
			t="cool"
			href="/work/endeavors/website"
			title="Website launch"
			meta="68% · next: approve homepage"
			trailing="›"
		/>
		<Row
			t="cool"
			href="/work/endeavors/build"
			title="Build pilot"
			meta="42% · 2 items waiting on Daniel"
			trailing="›"
		/>
		<Row t="cool" title="AME research" meta="Starts Monday" trailing="›" />
		<Btn t="cool" href="/work/endeavors/new" label="New endeavor" />
	{/if}
</Screen>
