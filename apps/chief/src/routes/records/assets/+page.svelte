<script>
	/**
	 * Assets — categories.
	 *
	 * Categories are the level you go into first. The list is the
	 * Chief's own: it can be added to and renamed, it is not a fixed set.
	 * Ones that hold something lead, each with its count and what it
	 * adds up to; the empty ones are kept out of the way until asked for,
	 * because twenty names with nothing in them bury the eight that
	 * matter.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Row, Btn, SectionHead, SourceNote } from '$lib/kit';
	import { page } from '$app/stores';
	import {
		activeAssets,
		assetValue,
		categorySummary,
		needingAttention,
		money
	} from '$lib/assets.js';

	const view = $derived($page.url.searchParams.get('state') ?? 'default');
	const { used, empty } = categorySummary();
	const count = activeAssets().length;
	const attn = needingAttention().length;
	let showEmpty = $state(false);

	/** @param {{ count: number, value: number, attention: number }} c */
	const line = (c) =>
		`${c.count} ${c.count === 1 ? 'asset' : 'assets'}` +
		(c.value ? ` · ${money(c.value)}` : '') +
		(c.attention ? ` · ${c.attention} need attention` : '');
</script>

<svelte:head><title>Assets · Chief</title></svelte:head>

<Screen back="/records" search nav={false}>
	{#if view === 'empty'}
		<!-- "Asset" is defined by example rather than by taxonomy. Nobody's
		     first thought is "intangible, non-inventory". -->
		<Hero
			t="warm"
			title="Nothing here yet"
			meta="An asset is anything you would want proof of later — a painting, a laptop, a domain, a contract."
		/>
		<Btn t="warm" href="/records/assets/new" label="Add the first one" />
		<Btn primary={false} label="Import from a spreadsheet" />
	{:else}
		<Row
			t="warm"
			href="/records/assets/in/all"
			title="All assets"
			meta="{count} assets · {money(assetValue())}"
			trailing="›"
		/>
		{#if attn}
			<Row
				t="alert"
				href="/records/assets/in/all?show=attention"
				title="{attn} need attention"
				meta="Each one says why"
				trailing="⚠"
			/>
		{/if}

		<SectionHead label="Categories" t="warm" count={used.length} />
		{#each used as c (c.id)}
			<Row t="warm" href="/records/assets/in/{c.id}" title={c.name} meta={line(c)} trailing="›" />
		{/each}

		{#if showEmpty}
			<SectionHead label="Empty" count={empty.length} />
			{#each empty as c (c.id)}
				<Row
					href="/records/assets/in/{c.id}"
					title={c.name}
					meta="Nothing in it yet"
					trailing="›"
				/>
			{/each}
		{:else}
			<Btn
				primary={false}
				label="Show {empty.length} empty categories"
				onclick={() => (showEmpty = true)}
			/>
		{/if}

		<Btn t="warm" href="/records/assets/new" label="Add asset" />
		<Btn primary={false} href="/records/assets/categories/new" label="New category" />
		<SourceNote source="fixture" />
	{/if}
</Screen>
