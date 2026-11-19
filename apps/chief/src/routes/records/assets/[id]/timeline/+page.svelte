<script>
	/**
	 * Assets — timeline.
	 * Everything that has happened to this one asset, newest first. The
	 * same events, across every asset, are the Activity feed.
	 *
	 * A line entered by mistake can be deleted. That takes the line out
	 * of the history and nothing else: a value deleted here stops being
	 * a value, but a move or a letting-go that was recorded is undone on
	 * the asset itself, not by deleting its line.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Row, Btn, Blank, Delete, Note } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS, events, ownBook } from '$lib/assets.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy } from '$lib/pb.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id]);

	/* The book is replaced in place when it is read again, which nothing
	   here can see. Counting the reads is what makes the list follow. */
	let reads = $state(0);
	const history = $derived.by(() => {
		void reads;
		return events(id);
	});
	let fixing = $state(false);

	/** @param {{ collection: string, id: string }} ref */
	async function remove(ref) {
		await destroy(ref.collection, ref.id);
		await reopenBook();
		reads += 1;
	}
</script>

<svelte:head><title>Timeline · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="Timeline" />
	{#each history as h, i (h.ref?.id ?? i)}
		<Row t="warm" title={h.type} meta={h.detail} trailing={h.when} />
		{#if fixing && h.ref}
			<Delete
				what="this line"
				warn={h.type === 'Re-valued'
					? 'That value goes; the one before it becomes the current value.'
					: 'Only the line goes. Anything it changed on the asset stays changed.'}
				label="Delete the line above"
				ondelete={() => remove(/** @type {NonNullable<typeof h.ref>} */ (h.ref))}
			/>
		{/if}
	{:else}
		<Blank>Nothing recorded yet.</Blank>
	{/each}
	{#if ownBook()}
		{#if !a.letGo}
			<Btn t="warm" href="/records/assets/{id}/record" label="Record what happened" />
		{/if}
		{#if history.some((h) => h.ref)}
			<Btn
				primary={false}
				label={fixing ? 'Done' : 'Delete a line'}
				onclick={() => (fixing = !fixing)}
			/>
		{/if}
		{#if fixing}
			<Note>For a line entered by mistake. What actually happened should stay on the record.</Note>
		{/if}
	{/if}
	<Btn t="ai" primary={false} href="/" label="Jot a timeline update" />
</Screen>
