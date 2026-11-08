<script>
	/**
	 * F1 Directory — D4 Organizations.
	 * An organization is a workspace with records attached, not a menu
	 * tile — so these are the same records the context switcher offers.
	 * Each is described by what it does rather than by its entity type;
	 * the word "entity" does not appear.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Row, Btn, SourceNote, EmptyLive } from '$lib/kit';
	import { listWorkspaces, seedDirectory } from '$lib/pb.js';

	let load = $state(listWorkspaces());

	async function seed() {
		await seedDirectory();
		load = listWorkspaces();
	}
</script>

<svelte:head><title>Organizations · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	{#await load}
		<Row t="cool" title="Loading organizations…" dot={false} />
	{:then { data, source }}
		{#if source === 'live' && data.length === 0}
			<EmptyLive what="organizations" onseed={seed} />
		{:else}
			{#each data as o (o.id)}
				<Row t="cool" href="/organizations/{o.id}" title={o.name} meta={o.meta} trailing="›" />
			{/each}
			<SourceNote {source} />
		{/if}
	{:catch}
		<Alert
			title="Could not load organizations"
			meta="Neither the backend nor the local fixtures answered."
		/>
	{/await}

	<Btn t="cool" href="/organizations/new" label="Add organization" />
</Screen>
