<script>
	/**
	 * Assets — attributes.
	 * The name, where it is filed, and the technical fields — all but
	 * the name optional, filled from what the record already holds.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, PageHead, Btn, Field, Select } from '$lib/kit';
	import AttributeFields from '$lib/asset/AttributeFields.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ASSETS, ASSET_CATEGORIES, ownBook } from '$lib/assets.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { archive, updateAsset } from '$lib/pb.js';

	const own = ownBook();
	const id = $page.params.id ?? '';
	const a = ASSETS[id];
	const categories = ASSET_CATEGORIES.map((c) => ({ value: c.id, label: c.name }));

	let name = $state(a.name);
	let category = $state(a.category);
	let blurb = $state(a.blurb);
	let rights = $state(a.rights);
	let period = $state(a.period);
	let quantity = $state(String(a.quantity));
	let notes = $state(a.notes);
	let tangible = $state(a.tangibility === 'Tangible' ? 0 : 1);
	let liquid = $state(a.liquidity === 'Liquid' ? 0 : 1);
	let inventory = $state(a.inventory === 'Inventory' ? 0 : 1);

	let busy = $state(false);
	let fault = $state('');
	let confirming = $state(false);

	const count = $derived(Number(quantity));
	const badCount = $derived(!Number.isFinite(count) || count <= 0);

	async function save() {
		if (!name.trim() || badCount || busy) return;
		busy = true;
		fault = '';
		try {
			await updateAsset(id, {
				name: name.trim(),
				category: category || null,
				blurb: blurb.trim(),
				rights,
				period: period.trim(),
				quantity: count,
				notes: notes.trim(),
				tangibility: tangible === 0 ? 'Tangible' : 'Intangible',
				liquidity: liquid === 0 ? 'Liquid' : 'Not liquid',
				inventory: inventory === 0 ? 'Inventory' : 'Not inventory'
			});
			await reopenBook();
			await goto(`/records/assets/${id}`);
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}

	async function remove() {
		busy = true;
		fault = '';
		try {
			await archive('assets', id);
			await reopenBook();
			await goto('/records/assets', { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Attributes · {a.name} · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="Attributes" meta="Optional until a decision needs them." />
	{#if own}
		<Field label="Asset name" bind:value={name} required />
		<Select label="Category" options={categories} bind:value={category} placeholder="No category" />
		<Field label="In a few words" placeholder="Optional" bind:value={blurb} />
	{/if}
	<AttributeFields
		bind:rights
		bind:period
		bind:quantity
		bind:notes
		bind:tangible
		bind:liquid
		bind:inventory
	/>
	{#if own}
		{#if badCount}<Alert title="Quantity has to be a number above zero" />{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Save'}
			onclick={save}
			disabled={!name.trim() || badCount || busy}
		/>
		{#if confirming}
			<Alert
				title="Remove {a.name}?"
				meta="For something entered by mistake. It leaves your lists and totals; its record is kept."
			/>
			<Btn t="alert" label="Yes, remove it" onclick={remove} disabled={busy} />
			<Btn primary={false} label="Keep it" onclick={() => (confirming = false)} />
		{:else}
			<Btn primary={false} label="Remove this asset" onclick={() => (confirming = true)} />
		{/if}
	{:else}
		<Btn t="warm" label="Save attributes" soon />
	{/if}
</Screen>
