<script>
	/**
	 * Assets — attributes.
	 * The technical fields, all optional, filled from what the record
	 * already holds. Add them when a decision or a proof needs them.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Btn } from '$lib/kit';
	import AttributeFields from '$lib/asset/AttributeFields.svelte';
	import { page } from '$app/stores';
	import { ASSETS } from '$lib/assets.js';

	const id = $page.params.id ?? '';
	const a = ASSETS[id] ?? ASSETS['nfta-014'];

	let rights = $state(a.rights);
	let period = $state(a.period);
	let quantity = $state(String(a.quantity));
	let notes = $state(a.notes);
	let tangible = $state(a.tangibility === 'Tangible' ? 0 : 1);
	let liquid = $state(a.liquidity === 'Liquid' ? 0 : 1);
	let inventory = $state(a.inventory === 'Inventory' ? 0 : 1);
</script>

<svelte:head><title>Attributes · {a.name} · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="Attributes" meta="Optional until a decision needs them." />
	<AttributeFields
		bind:rights
		bind:period
		bind:quantity
		bind:notes
		bind:tangible
		bind:liquid
		bind:inventory
	/>
	<Btn t="warm" href="/records/assets/{id}" label="Save attributes" />
</Screen>
