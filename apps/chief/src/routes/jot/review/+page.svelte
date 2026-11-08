<script>
	/**
	 * F2 Capture — Q4 Placement review.
	 * The strongest screen in the product and the one most at risk for screen
	 * readers. Every proposed write is visible and individually excludable,
	 * and the bulk button counts what is actually selected.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Appr, Btn } from '$lib/kit';

	let picks = $state([true, true, true, true]);
	const n = $derived(picks.filter(Boolean).length);

	const items = [
		{ t: 'Task · Call my daughter', m: 'Personal · linked to Daughter', c: '97%' },
		{ t: 'Calendar · 7:00–7:20 PM', m: 'Tonight · personal block', c: '94%' },
		{ t: 'Task · Talk to Carmen', m: 'Azbolt · linked to Carmen', c: '91%' },
		{ t: 'Calendar · 3:30–3:50 PM', m: 'Today · Azbolt block', c: '88%' }
	];
</script>

<svelte:head><title>Placement review · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Banner
		t="ai"
		title="Nothing exists yet"
		meta="These {n} records are created when you approve."
	/>

	{#each items as it, i (it.t)}
		<Appr
			bind:included={picks[i]}
			title={it.t}
			meta={it.m}
			confidence={it.c}
			index={i + 1}
			total={items.length}
		/>
	{/each}

	<Btn t="ai" href="/jot/approved" label="Approve {n} placements" />
	<Btn primary={false} href="/jot/adjust" label="Adjust selected" />
</Screen>
