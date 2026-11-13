<script>
	/**
	 * Assets — add, step one.
	 *
	 * Create the useful record first: a name, a category, who holds it
	 * and what it is worth. Only the name is required to save. An asset
	 * with no owner or no value is still saved — it shows up flagged,
	 * because a record you can find beats a record that is complete.
	 *
	 * The technical attributes are the second step, after the draft
	 * exists, so abandoning there loses nothing.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Field, Select, Btn, Note } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ASSET_CATEGORIES } from '$lib/assets.js';

	let name = $state('');
	let category = $state($page.url.searchParams.get('category') ?? '');
	let owner = $state('');
	let value = $state('');

	const categories = ASSET_CATEGORIES.map((c) => ({ value: c.id, label: c.name }));
	const owners = Object.entries(ORGS).map(([id, o]) => ({ value: id, label: o.name }));
	const back = $derived(category ? `/records/assets/in/${category}` : '/records/assets');

	/** @param {SubmitEvent} e */
	function create(e) {
		e.preventDefault();
		if (name.trim()) goto('/records/assets/new/attributes');
	}
</script>

<svelte:head><title>Add asset · Chief</title></svelte:head>

<Screen {back} nav={false}>
	<Prog t="warm" title="The record" value={0.5} meta="Step 1 of 2 · only the name is required" />
	<form onsubmit={create}>
		<Field label="Asset name" placeholder="Required" bind:value={name} required />
		<Select
			label="Category"
			options={categories}
			bind:value={category}
			placeholder="Choose category"
		/>
		<Select label="Owner" options={owners} bind:value={owner} placeholder="Organization" />
		<Field label="Current value" type="money" placeholder="Optional" bind:value />
		<Btn t="warm" type="submit" label="Create asset draft" disabled={!name.trim()} />
	</form>
	<Note>
		The draft appears in its category straight away. Without an owner or a value it is flagged as
		needing attention rather than hidden.
	</Note>
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
