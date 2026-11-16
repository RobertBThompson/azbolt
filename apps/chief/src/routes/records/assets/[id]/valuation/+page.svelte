<script>
	/**
	 * Assets — valuation.
	 *
	 * What the asset is worth and how old that figure is. A new figure
	 * is added with its date and never written over the old one: what
	 * was believed a year ago stays on the record as what was believed.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Stats, Row, Btn, Alert, Field, Note, Delete } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ASSETS, dollars, events, ownBook, short, staleAfter } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { addValuation, destroy } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();
	const id = $derived($page.params.id ?? '');
	const a = $derived.by(() => {
		void reads;
		return ASSETS[id];
	});
	/* The book is replaced in place when it is read again; counting the
	   reads is what makes this screen follow. */
	let reads = $state(0);
	let fixing = $state(false);
	const reviews = $derived.by(() => {
		void reads;
		return events(id).filter((e) => e.type === 'Re-valued');
	});

	/** @param {{ collection: string, id: string }} ref */
	async function removeValue(ref) {
		await destroy(ref.collection, ref.id);
		await reopenBook();
		reads += 1;
	}
	const stale = $derived(a.valuedDaysAgo !== null && a.valuedDaysAgo > staleAfter(a.category));

	let adding = $state(false);
	let value = $state('');
	let day = $state(today());
	let note = $state('');
	let busy = $state(false);
	let fault = $state('');

	const amount = $derived(readAmount(value));
	const ready = $derived(amount !== null && day !== '' && day <= today());

	/** @param {SubmitEvent} e */
	async function save(e) {
		e.preventDefault();
		if (amount === null || !ready || busy) return;
		busy = true;
		fault = '';
		try {
			await addValuation(id, dollars(amount), day, note);
			await reopenBook();
			await goto(`/records/assets/${id}`);
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Valuation · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="Valuation" />
	{#if a.value === null}
		<Alert title="No value recorded" meta="It is left out of net worth until it has one." />
	{:else if stale}
		<Alert title="This figure is getting old" meta="Net worth is still counting it as it was." />
	{/if}
	<Stats
		items={[
			[a.value === null ? '—' : short(a.value), 'Value'],
			[reviews[0]?.when ?? '—', 'Reviewed'],
			[String(reviews.length), reviews.length === 1 ? 'Review' : 'Reviews']
		]}
	/>

	{#if adding}
		<form onsubmit={save}>
			<Field label="What it is worth" type="money" bind:value required />
			<Field label="As of" type="date" bind:value={day} required />
			<Field label="Where the figure came from" placeholder="Optional" bind:value={note} />
			{#if value.trim() !== '' && amount === null}
				<Note>That is not an amount. Use figures, like 24,500.</Note>
			{:else if day > today()}
				<Note>A value cannot be dated in the future.</Note>
			{/if}
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="warm"
				type="submit"
				label={busy ? 'Saving…' : 'Save value'}
				disabled={!ready || busy}
			/>
			<Btn primary={false} label="Cancel" onclick={() => (adding = false)} />
		</form>
	{:else}
		{#each reviews as r, i (r.ref?.id ?? i)}
			<Row t="warm" title={r.detail} meta="Re-valued" trailing={r.when} />
			{#if fixing && r.ref}
				<Delete
					what="this value"
					warn={i === 0 && reviews.length > 1
						? 'The value before it becomes the current one.'
						: i === 0
							? 'The asset is left with no value, and out of the totals until it has one.'
							: 'It is an earlier value; the current one does not change.'}
					label="Delete the value above"
					ondelete={() => removeValue(/** @type {NonNullable<typeof r.ref>} */ (r.ref))}
				/>
			{/if}
		{/each}
		{#if own}
			<Btn
				t="warm"
				label={a.value === null ? 'Give it a value' : 'Update value'}
				onclick={() => (adding = true)}
			/>
			{#if reviews.some((r) => r.ref)}
				<Btn
					primary={false}
					label={fixing ? 'Done' : 'Delete a value'}
					onclick={() => (fixing = !fixing)}
				/>
			{/if}
		{:else}
			<Btn t="warm" label="Update valuation" soon />
		{/if}
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
