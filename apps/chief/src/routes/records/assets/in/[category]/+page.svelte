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
		ownBook,
		sumValue
	} from '$lib/assets.js';
	import { focused, inFocus, outOfView, totalInFocus } from '$lib/spheres.svelte.js';
	import { Delete, FocusNote } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy, renameCategory } from '$lib/pb.js';

	const cat = $derived($page.params.category ?? 'all');
	const all = $derived(cat === 'all');
	const inCat = $derived(
		activeAssets().filter((a) => all || (cat === 'none' ? !a.category : a.category === cat))
	);

	let q = $state('');
	let show = $state($page.url.searchParams.get('show') === 'attention' ? 2 : 0);

	const matching = $derived(
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
	/* Decision 10. An asset is in the spheres of whoever owns it. */
	const list = $derived(inFocus(matching, (a) => a.spheres));
	const total = $derived(
		totalInFocus(
			inCat,
			(a) => a.spheres,
			(a) => effectiveValue(a) ?? 0
		)
	);

	let renaming = $state(false);
	let newName = $state('');
	let fault = $state('');

	async function rename() {
		fault = '';
		try {
			await renameCategory(cat, newName);
			await reopenBook();
			// A fresh screen, so the new name is read from the reopened book.
			await goto(`/records/assets`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.response?.data?.name
				? 'There is already a category with that name.'
				: err?.message || 'The server did not answer.';
		}
	}

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
		eyebrow={focused()
			? `${money(total.focused)} in focus${total.related ? ` · ${money(total.related)} related` : ''}`
			: `${inCat.length} ${inCat.length === 1 ? 'asset' : 'assets'} · ${money(sumValue(inCat))}`}
		title={all ? 'All assets' : categoryName(cat)}
	/>
	<FocusNote
		what="assets here"
		quiet={list.filter((x) => x.quiet).length}
		hidden={outOfView(matching, (a) => a.spheres)}
	/>
	<Field label="Search assets" placeholder="Name, organization, sphere, claim" bind:value={q} />
	<Tabs items={['All', 'Verified', 'Needs attention']} active={show} onpick={(i) => (show = i)} />

	{#if show === 2 && list.length}
		<Alert
			title="{list.length} {list.length === 1 ? 'asset needs' : 'assets need'} attention"
			meta="Each row says what is missing or stale."
		/>
	{/if}

	{#each list as { item: a, quiet } (a.id)}
		<Row
			t="warm"
			href="/records/assets/{a.id}"
			title={a.name}
			meta={meta(a)}
			trailing={attention(a.id).length ? '⚠' : '›'}
			{quiet}
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
	{#if ownBook() && !all && cat !== 'none'}
		{#if renaming}
			<Field label="Category name" bind:value={newName} />
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn t="warm" label="Save name" onclick={rename} disabled={!newName.trim()} />
			<Btn primary={false} label="Cancel" onclick={() => (renaming = false)} />
		{:else}
			<Btn
				primary={false}
				label="Rename this category"
				onclick={() => ((newName = categoryName(cat)), (renaming = true))}
			/>
			<Delete
				what={categoryName(cat)}
				warn={inCat.length
					? `The ${inCat.length === 1 ? 'asset in it is' : `${inCat.length} assets in it are`} kept and left with no category.`
					: 'Nothing is filed in it.'}
				label="Delete this category"
				ondelete={async () => {
					await destroy('asset_categories', cat);
					await reopenBook();
					await goto('/records/assets', { replaceState: true });
				}}
			/>
		{/if}
	{/if}
</Screen>
