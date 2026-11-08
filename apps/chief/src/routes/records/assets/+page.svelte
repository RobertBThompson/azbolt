<script>
	/**
	 * B5 Assets & Evidence — E1 Assets.
	 * Net worth is the headline because it is the only number that answers a
	 * question. v2's Categories screen became this chip row; creating an
	 * asset went from nine required decisions to two.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Stats, Field, Chips, Row, Alert, Btn, Note } from '$lib/kit';
	import { page } from '$app/stores';

	const view = $derived($page.url.searchParams.get('state') ?? 'default');
</script>

<svelte:head><title>Assets · Chief</title></svelte:head>

<Screen back="/records" search nav={false}>
	{#if view === 'empty'}
		<!-- "Asset" is defined by example rather than by taxonomy. Nobody's
		     first thought is "intangible, non-inventory". -->
		<Hero
			t="warm"
			title="Nothing here yet"
			meta="An asset is anything you would want proof of later — a painting, a laptop, a domain, a contract."
		/>
		<Btn t="warm" href="/records/assets/new" label="Add the first one" />
		<Btn primary={false} label="Import from a spreadsheet" />
	{:else if view === 'attention'}
		<!-- Attention is a count with reasons, never a red badge with no
		     explanation. The flagged rows are not moved or hidden. -->
		<Alert
			title="2 assets need attention"
			meta="A movement authorisation expired and a valuation is 14 months old."
		/>
		<Row
			t="warm"
			href="/records/assets/nfta-014"
			title="NFTA artwork #022"
			meta="Movement pending since 2 August"
			trailing="⚠"
		/>
		<Row
			t="warm"
			href="/records/assets/studio-collection"
			title="Studio collection"
			meta="Valuation 14 months old"
			trailing="⚠"
		/>
		<Btn t="warm" label="Review both" />
		<Note
			>Nothing is marked unverified automatically — Chief says what is stale and lets you decide.</Note
		>
	{:else}
		<Stats
			items={[
				['$—', 'Assets'],
				['$—', 'Owed'],
				['$—', 'Net']
			]}
		/>
		<Field label="Search" placeholder="Name, owner, tag, claim" />
		<Chips t="warm" items={['All', 'Art', 'Property', 'Equipment', 'IP']} />
		<Row
			t="warm"
			href="/records/assets/nfta-014"
			title="NFTA artwork #014"
			meta="Verified · secure storage"
			trailing="›"
		/>
		<Row
			t="warm"
			href="/records/assets/studio-collection"
			title="Studio collection"
			meta="4 linked works"
			trailing="›"
		/>
		<Row t="warm" title="Delivery van" meta="Equipment · Build" trailing="›" />
		<Btn t="warm" href="/records/assets/new" label="Add asset" />
	{/if}
</Screen>
