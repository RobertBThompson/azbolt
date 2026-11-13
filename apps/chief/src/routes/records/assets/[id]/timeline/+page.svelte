<script>
	/**
	 * Assets — timeline.
	 * Everything that has happened to this one asset, newest first. The
	 * same events, across every asset, are the Activity feed.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Row, Btn, Blank } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS, events } from '$lib/assets.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id] ?? ASSETS['nfta-014']);
	const history = $derived(events(ASSETS[id] ? id : 'nfta-014'));
</script>

<svelte:head><title>Timeline · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="Timeline" />
	{#each history as h (h.type + h.detail)}
		<Row t="warm" title={h.type} meta={h.detail} trailing={h.when} />
	{:else}
		<Blank>Nothing recorded yet.</Blank>
	{/each}
	<Btn t="ai" primary={false} href="/jot" label="Jot a timeline update" />
</Screen>
