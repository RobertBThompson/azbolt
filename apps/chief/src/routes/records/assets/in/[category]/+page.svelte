<script>
	/**
	 * Assets — the list inside a category.
	 *
	 * "all" is every category at once. Search runs over what a person
	 * would actually type: the name, who holds it, a sphere, a kind of
	 * claim. The three filters are the three questions asked of a list of
	 * things you own — all of it, what is proven, what needs looking at.
	 *
	 * A row that needs attention says why in place of its usual line, so
	 * the reason is read before the row is opened. Nothing is hidden or
	 * moved for being flagged.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Blank, Btn, Field, Note, PageHead, Row, Tabs } from '$lib/kit';
	import { page } from '$app/stores';
	import {
		activeAssets,
		amountOrAsk,
		attention,
		categoryName,
		effectiveValue,
		isVerified,
		money,
		ownerLine,
		sumValue
	} from '$lib/assets.js';

	const cat = $derived($page.params.category ?? 'all');
	const all = $derived(cat === 'all');
	const inCat = $derived(activeAssets().filter((a) => all || a.category === cat));

	let q = $state('');
	let show = $state($page.url.searchParams.get('show') === 'attention' ? 2 : 0);

	const list = $derived(
		inCat.filter((a) => {
			if (show === 1 && !isVerified(a)) return false;
			if (show === 2 && !attention(a.id).length) return false;
			const needle = q.trim().toLowerCase();
			if (!needle) return true;
			const hay = [a.name, ownerLine(a.id), ...a.spheres, ...a.claims.map((c) => c.kind)]
				.join(' ')
				.toLowerCase();
			return hay.includes(needle);
		})
	);

	/** @param {(typeof inCat)[number]} a */
	const meta = (a) => {
		const why = attention(a.id);
		if (why.length) return why.join(' · ');
		return `${ownerLine(a.id)} · ${amountOrAsk(effectiveValue(a))}`;
	};
</script>

<svelte:head><title>{all ? 'All assets' : categoryName(cat)} · Chief</title></svelte:head>

<Screen back="/records/assets" search nav={false}>
	<PageHead
		eyebrow="{inCat.length} {inCat.length === 1 ? 'asset' : 'assets'} · {money(sumValue(inCat))}"
		title={all ? 'All assets' : categoryName(cat)}
	/>
	<Field label="Search assets" placeholder="Name, organization, sphere, claim" bind:value={q} />
	<Tabs items={['All', 'Verified', 'Needs attention']} active={show} onpick={(i) => (show = i)} />

	{#if show === 2 && list.length}
		<Alert
			title="{list.length} {list.length === 1 ? 'asset needs' : 'assets need'} attention"
			meta="Each row says what is missing or stale."
		/>
	{/if}

	{#each list as a (a.id)}
		<Row
			t="warm"
			href="/records/assets/{a.id}"
			title={a.name}
			meta={meta(a)}
			trailing={attention(a.id).length ? '⚠' : '›'}
		/>
	{:else}
		<Blank>
			{#if !inCat.length}Nothing in this category yet.{:else}Nothing here matches.{/if}
		</Blank>
	{/each}

	<Btn t="warm" href="/records/assets/new{all ? '' : `?category=${cat}`}" label="Add asset" />
	{#if show === 2}
		<Note>
			Nothing is marked unverified automatically — Chief says what is stale and lets you decide.
		</Note>
	{/if}
</Screen>
