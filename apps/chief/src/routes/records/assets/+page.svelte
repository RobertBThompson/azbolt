<script>
	/**
	 * Assets — what you hold, and the categories it is filed in.
	 *
	 * The total leads, and it is also the way into every asset at once:
	 * "All assets" used to be a white row like each category under it,
	 * so nothing said it was a different kind of thing. Adding an asset
	 * is the commonest reason to be here, so it is straight under the
	 * total, not at the foot below every category.
	 *
	 * Categories are tiles, not rows. They are places to look, and the
	 * Chief's own list: it can be added to and renamed. Ones that hold
	 * something lead; the empty ones wait until asked for, because twenty
	 * names with nothing in them bury the eight that matter.
	 *
	 * Nothing here says what needs attention. That is not a reason to
	 * open this screen, and what is critical about an asset is checked
	 * when it is made or changed (Robert, 16 Nov).
	 */
	import { book } from '$lib/book.svelte.js';
	import Screen from '$lib/shell/Screen.svelte';
	import { Btn, Hero, Lead, SectionHead, SourceNote, Tiles } from '$lib/kit';
	import { page } from '$app/stores';
	import { activeAssets, assetValue, categorySummary, money } from '$lib/assets.js';

	const view = $derived($page.url.searchParams.get('state') ?? 'default');
	const { used, empty } = categorySummary();
	const count = activeAssets().length;
	let showEmpty = $state(false);

	/** @param {number} n */
	const assets = (n) => `${n} ${n === 1 ? 'asset' : 'assets'}`;
</script>

<svelte:head><title>Assets · Chief</title></svelte:head>

<Screen back="/records" search nav={false}>
	{#if view === 'empty' || count === 0}
		<!-- "Asset" is defined by example rather than by taxonomy. Nobody's
		     first thought is "intangible, non-inventory". -->
		<Hero
			t="warm"
			title="Nothing here yet"
			meta="An asset is anything you would want proof of later — a painting, a laptop, a domain, a contract."
		/>
		<Btn t="warm" href="/records/assets/new" label="Add the first one" />
		<Btn primary={false} label="Import from a spreadsheet" soon />
		<SourceNote source={book.source} error={book.error} />
	{:else}
		<Lead
			figure={money(assetValue())}
			label={assets(count)}
			href="/records/assets/in/all"
			more="See all {assets(count)}"
		/>
		<Btn t="warm" href="/records/assets/new" label="Add asset" />

		<SectionHead label="Categories" t="warm" count={used.length} />
		<Tiles
			label="Categories"
			items={used.map((c) => ({
				key: c.id,
				href: `/records/assets/in/${c.id}`,
				title: c.name,
				value: c.value ? money(c.value) : '',
				line: assets(c.count)
			}))}
		/>

		{#if empty.length}
			{#if showEmpty}
				<SectionHead label="Empty" count={empty.length} />
				<Tiles
					label="Empty categories"
					items={empty.map((c) => ({
						key: c.id,
						href: `/records/assets/in/${c.id}`,
						title: c.name,
						line: 'Nothing in it yet',
						quiet: true
					}))}
				/>
			{:else}
				<Btn
					primary={false}
					label="Show {empty.length} empty {empty.length === 1 ? 'category' : 'categories'}"
					onclick={() => (showEmpty = true)}
				/>
			{/if}
		{/if}
		<Btn primary={false} href="/records/assets/categories/new" label="New category" />
		<SourceNote source={book.source} error={book.error} />
	{/if}
</Screen>
