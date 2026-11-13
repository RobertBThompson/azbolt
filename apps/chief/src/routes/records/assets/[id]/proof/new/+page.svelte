<script>
	/**
	 * B5 — E8 Add proof.
	 * A filename is not evidence. Chief asks what the item proves and where
	 * it came from, then saves it as pending until its checks are visible.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Chips, Field, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS } from '$lib/assets.js';

	const a = $derived(ASSETS[$page.params.id ?? ''] ?? ASSETS['nfta-014']);
</script>

<svelte:head><title>Add proof · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}/proof" nav={false}>
	<Banner t="warm" title="What does this prove?" meta="Link it to the asset claim it supports." />
	<Chips t="warm" items={['Document', 'Photo', 'Link']} />
	<Field label="Title" placeholder="For example: storage confirmation" />
	<Field label="Source" placeholder="Issuer, person or URL" />
	<Row t="warm" title="Supports" meta={a.name} trailing="›" />
	<Btn
		t="warm"
		href="/records/assets/{$page.params.id}/proof/record"
		label="Save for verification"
	/>
</Screen>
