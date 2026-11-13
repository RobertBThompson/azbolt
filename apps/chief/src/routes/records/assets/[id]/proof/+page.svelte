<script>
	/**
	 * Assets — claims and files.
	 * What is on file to show the asset is what it is said to be, held
	 * where it is said to be, by whom. A tick is a claim that has been
	 * checked; a dash is one that has not, and says so.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Row, Btn, Blank } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS } from '$lib/assets.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id] ?? ASSETS['nfta-014']);
	const verified = $derived(a.claims.filter((c) => c.verified).length);
</script>

<svelte:head><title>Claims & files · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead
		eyebrow={a.name}
		title="Claims & files"
		meta="{verified} of {a.claims.length} verified"
	/>
	{#each a.claims as c (c.kind)}
		<Row
			t="warm"
			href="/records/assets/{id}/proof/record"
			title={c.kind}
			meta={c.detail}
			trailing={c.verified ? '✓' : '—'}
		/>
	{:else}
		<Blank>No proof on file yet.</Blank>
	{/each}
	<Btn t="warm" href="/records/assets/{id}/proof/new" label="Add proof" />
</Screen>
