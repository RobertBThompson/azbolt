<script>
	/**
	 * B5 — E10 Storage and movement.
	 * Movement changes physical custody, never ownership. That sentence is
	 * repeated at the decision point because conflating the two is the most
	 * consequential asset error this flow can create.
	 *
	 * An account's own asset shows where it is kept and each time it has
	 * moved. The authorisation walk-through — from, to, who signed —
	 * is the sample's, and stays with the samples.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Blank, Row, Btn, SectionHead } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS, ORGS, controllingOrgs, events, ownBook } from '$lib/assets.js';

	const own = ownBook();
	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id]);
	// The organization the chain ends at, however many assets it passes through.
	const holder = $derived(
		controllingOrgs(id)
			.map((o) => ORGS[o]?.name ?? o)
			.join(' and ')
	);
	const moves = $derived(events(id).filter((e) => e.type === 'Moved'));
</script>

<svelte:head><title>Movement · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}" nav={false}>
	<Alert
		title="Custody changes; ownership does not"
		meta={holder
			? `${holder} remains the owner of ${a.name} throughout any movement.`
			: `Nobody is recorded as the owner of ${a.name}. Settle that before it moves.`}
	/>
	{#if own}
		<Row t="warm" title="Kept at" meta={a.storage || 'Not recorded'} />
		<SectionHead label="Moves" t="warm" count={moves.length} />
		{#each moves as m, i (i)}
			<Row t="warm" title={m.detail} meta="Moved" trailing={m.when} />
		{:else}
			<Blank>No move recorded.</Blank>
		{/each}
		{#if !a.letGo}
			<Btn t="warm" href="/records/assets/{id}/record?kind=Moved" label="Record a move" />
		{/if}
	{:else}
		<Row t="warm" title="From" meta="Secure facility" trailing="›" />
		<Row t="warm" title="To" meta="Exhibition storage" trailing="›" />
		<Row t="warm" title="When" meta="18–26 August" trailing="›" />
		<Row
			t="warm"
			href="/people/dev"
			title="Authorised by"
			meta="Dev Patel · proof attached"
			trailing="↗"
		/>
		<Btn t="warm" label="Approve movement" soon />
	{/if}
</Screen>
