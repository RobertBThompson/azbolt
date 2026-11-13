<script>
	/**
	 * Activity — what has happened to what you hold.
	 *
	 * One feed of asset events across every asset, newest first. An
	 * asset's own timeline is this same list narrowed to it; nothing is
	 * recorded in one that is missing from the other.
	 *
	 * Six things happen to an asset: it is acquired, moved, transferred,
	 * re-valued, kept up, or let go. The filter is those six.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Filter, Row, Btn, SourceNote, Blank } from '$lib/kit';
	import { EVENT_TYPES, events } from '$lib/assets.js';

	const all = events();
	const items = [
		{ key: 'all', label: 'All', count: all.length },
		...EVENT_TYPES.map((t) => ({
			key: t,
			label: t,
			count: all.filter((e) => e.type === t).length
		}))
	];

	let type = $state('all');
	const list = $derived(all.filter((e) => type === 'all' || e.type === type));
</script>

<svelte:head><title>Activity · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<Filter label="Kind of event" {items} bind:active={type} />
	{#each list as e (e.asset + e.type + e.detail)}
		<Row
			t="warm"
			href="/records/assets/{e.asset}"
			title="{e.type} · {e.name}"
			meta={e.detail}
			trailing={e.when}
		/>
	{:else}
		<Blank>Nothing of that kind has happened yet.</Blank>
	{/each}
	<Btn t="ai" primary={false} href="/" label="Jot an asset update" />
	<SourceNote source="fixture" />
</Screen>
