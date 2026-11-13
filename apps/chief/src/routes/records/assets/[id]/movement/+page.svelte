<script>
	/**
	 * B5 — E10 Movement authorisation.
	 * Movement changes physical custody, never ownership. That sentence is
	 * repeated at the decision point because conflating the two is the most
	 * consequential asset error this flow can create.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS, controllingOrgs } from '$lib/assets.js';
	import { ORGS } from '$lib/data.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id] ?? ASSETS['nfta-014']);
	// The organization the chain ends at, however many assets it passes through.
	const holder = $derived(
		controllingOrgs(ASSETS[id] ? id : 'nfta-014')
			.map((o) => ORGS[o]?.name ?? o)
			.join(' and ')
	);
</script>

<svelte:head><title>Movement · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}" nav={false}>
	<Alert
		title="Custody changes; ownership does not"
		meta={holder
			? `${holder} remains the owner of ${a.name} throughout this movement.`
			: `Nobody is recorded as the owner of ${a.name}. Settle that before it moves.`}
	/>
	<Row t="warm" title="From" meta="Secure facility" trailing="›" />
	<Row t="warm" title="To" meta="Exhibition storage" trailing="›" />
	<Row t="warm" title="When" meta="18–26 August" trailing="›" />
	<Row
		t="warm"
		href="/people/pamela"
		title="Authorised by"
		meta="Pamela Anderson · proof attached"
		trailing="↗"
	/>
	<Btn t="warm" label="Approve movement" />
</Screen>
