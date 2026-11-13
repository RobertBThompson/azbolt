<script>
	/**
	 * Assets — a new category.
	 * The list of categories is the Chief's to edit. A name is all it
	 * takes; nothing has to be decided about what will go in it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { ASSET_CATEGORIES, slug } from '$lib/assets.js';

	let name = $state('');
	const clash = $derived(ASSET_CATEGORIES.some((c) => c.id === slug(name)));

	/** @param {SubmitEvent} e */
	function save(e) {
		e.preventDefault();
		if (name.trim() && !clash) goto('/records/assets');
	}
</script>

<svelte:head><title>New category · Chief</title></svelte:head>

<Screen back="/records/assets" nav={false}>
	<Banner
		t="warm"
		title="Your own grouping"
		meta="Categories are a list you edit, not a fixed set."
	/>
	<form onsubmit={save}>
		<Field label="Category name" placeholder="For example: Livestock" bind:value={name} required />
		<Btn t="warm" type="submit" label="Save category" disabled={!name.trim() || clash} />
	</form>
	{#if clash}
		<Note>There is already a category with that name.</Note>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
