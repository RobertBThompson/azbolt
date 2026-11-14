<script>
	/**
	 * Assets — a new category.
	 * The list of categories is the Chief's to edit. A name is all it
	 * takes; nothing has to be decided about what will go in it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { ASSET_CATEGORIES, ownBook } from '$lib/assets.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { createCategory } from '$lib/pb.js';

	const own = ownBook();

	let name = $state('');
	let busy = $state(false);
	let fault = $state('');
	const clash = $derived(
		ASSET_CATEGORIES.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())
	);

	/** @param {SubmitEvent} e */
	async function save(e) {
		e.preventDefault();
		if (!name.trim() || clash || busy) return;
		busy = true;
		fault = '';
		try {
			const made = await createCategory(name);
			await reopenBook();
			await goto(`/records/assets/in/${made.id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.response?.data?.name
				? 'You had a category by that name and retired it. Choose another name.'
				: err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>New category · Chief</title></svelte:head>

<Screen back="/records/assets" nav={false}>
	<Banner
		t="warm"
		title="Your own grouping"
		meta="Categories are a list you edit, not a fixed set."
	/>
	{#if own}
		<form onsubmit={save}>
			<Field
				label="Category name"
				placeholder="For example: Livestock"
				bind:value={name}
				required
			/>
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="warm"
				type="submit"
				label={busy ? 'Saving…' : 'Save category'}
				disabled={!name.trim() || clash || busy}
			/>
		</form>
		{#if clash}
			<Note>There is already a category with that name.</Note>
		{/if}
	{:else}
		<Note>The categories on show are samples. Sign in to keep a list of your own.</Note>
		<Btn t="warm" href="/signin" label="Sign in" />
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
