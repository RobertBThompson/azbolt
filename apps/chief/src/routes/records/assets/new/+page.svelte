<script>
	/**
	 * Assets — add.
	 *
	 * A name is enough to save. A category and a value can be given now
	 * or later: an asset with no value is still kept, flagged as needing
	 * one and left out of every total until it has it, because a record
	 * you can find beats a record that is complete.
	 *
	 * Signed out, this walks through the sample flow and keeps nothing,
	 * and says so.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Prog, Field, Select, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ASSET_CATEGORIES, ORGS, dollars, ownBook } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { addValuation, createAsset } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();

	let name = $state('');
	const asked = $page.url.searchParams.get('category') ?? '';
	let category = $state(asked === 'all' || asked === 'none' ? '' : asked);
	let owner = $state('');
	let value = $state('');
	let busy = $state(false);
	let fault = $state('');

	const categories = ASSET_CATEGORIES.map((c) => ({ value: c.id, label: c.name }));
	const owners = Object.entries(ORGS).map(([id, o]) => ({ value: id, label: o.name }));
	const back = $derived(category ? `/records/assets/in/${category}` : '/records/assets');

	const amount = $derived(readAmount(value));
	const badValue = $derived(value.trim() !== '' && amount === null);
	const ready = $derived(name.trim() !== '' && !badValue);

	/** @param {SubmitEvent} e */
	async function create(e) {
		e.preventDefault();
		if (!ready || busy) return;
		if (!own) return goto('/records/assets/new/attributes');
		busy = true;
		fault = '';
		try {
			const id = await createAsset({ name, category });
			if (amount !== null) await addValuation(id, dollars(amount), today());
			await reopenBook();
			await goto(`/records/assets/${id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Add asset · Chief</title></svelte:head>

<Screen {back} nav={false}>
	{#if !own}
		<Prog t="warm" title="The record" value={0.5} meta="Step 1 of 2 · only the name is required" />
	{/if}
	<form onsubmit={create}>
		<Field label="Asset name" placeholder="Required" bind:value={name} required />
		<Select
			label="Category"
			options={categories}
			bind:value={category}
			placeholder="Choose category"
		/>
		{#if !own}
			<Select label="Owner" options={owners} bind:value={owner} placeholder="Organization" />
		{/if}
		<Field label="What it is worth today" type="money" placeholder="Optional" bind:value />
		{#if badValue}<Note>That is not an amount. Use figures, like 24,500.</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			type="submit"
			label={own ? (busy ? 'Saving…' : 'Save asset') : 'Create asset draft'}
			disabled={!ready || busy}
		/>
	</form>
	<Note>
		{#if own}
			Only the name is required. Without a value it is flagged as needing one and left out of totals
			until it has it. Who owns it is recorded under Ownership.
		{:else}
			This is the sample flow: nothing typed here is kept. Sign in to add your own.
		{/if}
	</Note>
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
