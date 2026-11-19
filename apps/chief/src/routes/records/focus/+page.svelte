<script>
	/**
	 * Now, Soon, Later — every asset held, and where each one stands, on
	 * one screen (Robert, 19 Nov).
	 *
	 * Moving an asset one at a time means opening each. Deciding what is
	 * the focus is done across all of them at once, so here each asset
	 * has the same three buttons as its own page, small, in its row. A tap
	 * is saved straight away. The list stays in name order while you work,
	 * so nothing jumps away from under your thumb; the count at the top
	 * says where things now stand.
	 *
	 * Done is not offered: letting an asset go is recorded on its own
	 * page, as what happened to it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Blank, PageHead, Seg, SourceNote } from '$lib/kit';
	import { book, reopenBook } from '$lib/book.svelte.js';
	import { ASSETS, effectiveValue, money, ownBook, stateOf } from '$lib/assets.js';
	import { updateAsset } from '$lib/pb.js';
	import { inFocus } from '$lib/spheres.svelte.js';
	import { onDestroy } from 'svelte';

	const STANDING = ['Now', 'Soon', 'Later'];

	/** @typedef {import('$lib/assets.js').AssetRow} AssetRow */
	const held = /** @type {AssetRow[]} */ (
		Object.entries(ASSETS)
			.map(([id, a]) => ({ id, ...a }))
			.filter((a) => stateOf(a) !== 'Done')
			.sort((x, y) => x.name.localeCompare(y.name))
	);
	const seen = $derived(inFocus(held, (a) => a.spheres));

	/** Where each stands now, as tapped. */
	let where = $state(
		/** @type {Record<string, number>} */ (
			Object.fromEntries(held.map((a) => [a.id, Math.max(0, STANDING.indexOf(stateOf(a)))]))
		)
	);
	let fault = $state('');
	let changed = false;

	const tally = $derived(
		STANDING.map(
			(s, i) => `${seen.filter((x) => where[x.item.id] === i).length} ${s.toLowerCase()}`
		).join(' · ')
	);

	/** @param {string} id @param {number} i */
	async function stand(id, i) {
		const was = STANDING.indexOf(stateOf(ASSETS[id]));
		fault = '';
		try {
			await updateAsset(id, { state: STANDING[i] });
			ASSETS[id].state = STANDING[i];
			changed = true;
		} catch (/** @type {any} */ err) {
			where[id] = Math.max(0, was);
			fault = `${ASSETS[id].name} was not moved: ${err?.message || 'the server did not answer.'}`;
		}
	}

	/* Everything else reads the book again once, on the way out, rather
	   than after every tap. */
	onDestroy(() => {
		if (changed) reopenBook();
	});

	/** @param {AssetRow} a */
	const line = (a) => {
		const v = effectiveValue(a);
		return v === null ? 'No value yet' : money(v);
	};
</script>

<svelte:head><title>Now, Soon, Later · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<PageHead
		eyebrow="Assets"
		title="Now, Soon, Later"
		meta={ownBook()
			? `Tap where each one stands; it is saved as you go. ${tally}.`
			: 'Sign in to move your own assets. These are samples.'}
	/>
	{#if fault}<Alert title="Not saved" meta={fault} />{/if}

	{#each seen as { item: a, quiet } (a.id)}
		<div class="item" class:quiet>
			<span class="name">{a.name}</span>
			<span class="meta">{line(a)}</span>
			<Seg
				small
				t="warm"
				items={STANDING}
				bind:active={where[a.id]}
				disabled={!ownBook()}
				onpick={(i) => stand(a.id, i)}
			/>
		</div>
	{:else}
		<Blank>No assets held here yet.</Blank>
	{/each}

	<SourceNote source={book.source} error={book.error} />
</Screen>

<style>
	.item {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 13px 14px 12px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
	}
	.item.quiet {
		opacity: 0.72;
	}
	.name {
		font-size: 16.5px;
		font-weight: 700;
		color: var(--ink);
	}
	.meta {
		font-size: 14px;
		color: var(--ink-3);
		margin-bottom: 7px;
	}
</style>
