<script>
	/**
	 * B3 Work — W1 Endeavors.
	 * Each row carries the next action, not just a percentage. A list of
	 * progress bars tells you nothing you can act on.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import {
		Hero,
		Banner,
		Tabs,
		Row,
		Seg,
		Alert,
		Btn,
		Note,
		Blank,
		FocusNote,
		SourceNote
	} from '$lib/kit';
	import { page } from '$app/stores';
	import { ENDEAVOR_STAGES, nextOn, progressOf, spheresOf } from '$lib/work.js';
	import { inFocus, outOfView } from '$lib/spheres.svelte.js';
	import { work, kept, load, orgOf } from '$lib/work.svelte.js';

	const LENSES = [
		{ label: 'Tasks', href: '/work', icon: 'task' },
		{ label: 'Endeavors', href: '/work/endeavors', icon: 'action' }
	];

	let active = $state(0);
	let keep = $state(0);
	const view = $derived($page.url.searchParams.get('state') ?? 'default');
	const stage = $derived(ENDEAVOR_STAGES[active]);
	/** @param {import('$lib/work.js').Endeavor} e */
	const ofEndeavor = (e) => spheresOf(e, work.orgs);
	const inStage = $derived(work.endeavors.filter((e) => e.stage === stage));
	const list = $derived(inFocus(inStage, ofEndeavor));
	const none = $derived(kept() && work.endeavors.length === 0);

	/**
	 * What to act on, not just how far along: the share done, then the
	 * next task. Both come from the endeavor's own tasks.
	 * @param {import('$lib/work.js').Endeavor} e
	 */
	function line(e) {
		const p = progressOf(e.id, work.tasks);
		const next = nextOn(e.id, work.tasks);
		return [
			orgOf(e.organization)?.name,
			p.share === null ? 'no tasks yet' : `${p.done} of ${p.total} done`,
			e.stage !== 'Done' && next ? `next: ${next.name}` : ''
		]
			.filter(Boolean)
			.join(' · ');
	}
</script>

<svelte:head><title>Endeavors · Chief</title></svelte:head>

<Screen>
	<LensSwitch label="Action view" items={LENSES} at="/work/endeavors" />

	{#if view === 'empty' || none}
		<!-- The empty state is the glossary: this is where the word
		     "endeavor" is finally introduced, with right and wrong phrasing. -->
		<Hero
			t="cool"
			title="No endeavors yet"
			meta="An endeavor is a thing you want to be true — “the site is live”, not “website”."
		/>
		<Banner t="cool" title="Good" meta="“Customers can buy without emailing us”" />
		<Btn t="cool" href="/work/endeavors/new" label="Name one outcome" />
		{#if !none}
			<Btn primary={false} href="/work/endeavors" label="See an example" />
		{/if}
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
		<Tabs items={ENDEAVOR_STAGES} {active} onpick={(i) => (active = i)} />
		<FocusNote
			what="endeavors here"
			quiet={list.filter((x) => x.quiet).length}
			hidden={outOfView(inStage, ofEndeavor)}
		/>
		{#each list as { item: e, quiet } (e.id)}
			<Row
				t="cool"
				href="/work/endeavors/{e.id}"
				title={e.name}
				meta={line(e)}
				trailing="›"
				{quiet}
			/>
		{:else}
			{#if work.source !== 'error'}
				<Blank>
					{stage === 'Active'
						? 'Nothing under way.'
						: stage === 'Planned'
							? 'Nothing planned.'
							: 'Nothing finished yet.'}
				</Blank>
			{/if}
		{/each}
		<Btn t="cool" href="/work/endeavors/new" label="New endeavor" />
		<SourceNote source={work.source} error={work.error} onretry={load} />
	{/if}
</Screen>
