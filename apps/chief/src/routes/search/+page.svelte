<script>
	/**
	 * F0 Shell — SH2 Global search.
	 * Search is a shell affordance, not a tab. Results carry their branch, so
	 * a result never lands you somewhere unlabelled.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Field, Chips, Row, Note } from '$lib/kit';
</script>

<svelte:head><title>Search · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Field label="Search" placeholder="People, work, assets, notes" />
	<Chips items={['All', 'People', 'Work', 'Assets']} />
	<Row title="Carmen Ruiz" meta="Person · Azbolt" trailing="↗" href="/people/carmen" />
	<Row
		title="NFTA artwork #014"
		meta="Asset · verified"
		trailing="↗"
		href="/records/assets/nfta-014"
	/>
	<Row title="Talk to Carmen" meta="Task · today 3:30 PM" trailing="↗" href="/work/tasks/carmen" />
	<Note>Results carry their branch, so a result never lands you somewhere unlabelled.</Note>
</Screen>
