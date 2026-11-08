<script>
	/**
	 * F1 Directory — D1 People.
	 * The list leads with the next interaction, not the job title: the
	 * reason you open a person is almost always temporal. Search appears
	 * here because this list gets long — it is deliberately absent from
	 * the short lists elsewhere.
	 *
	 * Reads from PocketBase when one is reachable and a session is live,
	 * and falls back to the design fixtures otherwise, saying which it used.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Field, Chips, Row, Btn, SourceNote, EmptyLive } from '$lib/kit';
	import { listPeople, seedDirectory } from '$lib/pb.js';

	let load = $state(listPeople());

	async function seed() {
		await seedDirectory();
		load = listPeople();
	}
</script>

<svelte:head><title>People · Chief</title></svelte:head>

<Screen search>
	<Field label="Search people" placeholder="Name, relationship, organization" />
	<Chips t="cool" items={['All', 'Personal', 'Work']} />

	{#await load}
		<Row t="cool" title="Loading people…" dot={false} />
	{:then { data, source }}
		{#if source === 'live' && data.length === 0}
			<EmptyLive what="people" onseed={seed} />
		{:else}
			{#each data as p (p.id)}
				<Row t="cool" href="/people/{p.id}" title={p.name} meta={p.meta} trailing="›" />
			{/each}
			<SourceNote {source} />
		{/if}
	{:catch}
		<Alert
			title="Could not load people"
			meta="Neither the backend nor the local fixtures answered."
		/>
	{/await}

	<Row
		t="cool"
		href="/organizations"
		title="Organizations"
		meta="Spheres with records attached"
		trailing="›"
	/>
	<Btn t="cool" href="/people/add" label="Add person" />
</Screen>
