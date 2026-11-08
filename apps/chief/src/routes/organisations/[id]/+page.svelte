<script>
	/**
	 * F1 Directory — D5/D6/D7 Organisation profile.
	 * One component, three structures. Azbolt is a company, Eagle DAO is
	 * member-governed and SAVE is a nonprofit: the same slots hold members,
	 * governance and oversight without changing the page architecture.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Stats, Row, Btn } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { shell } from '$lib/state.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const org = $derived(ORGS[$page.params.id ?? ''] ?? ORGS.azbolt);

	function switchInto() {
		if (org.context) shell.context = org.context;
		goto('/');
	}
</script>

<svelte:head><title>{org.name} · Chief</title></svelte:head>

<Screen back="/organisations" nav={false}>
	<Banner t="cool" title={org.name} meta={org.blurb} />
	<Stats items={org.stats} />
	{#each org.rows as r (r.t)}
		<Row t={r.tone ?? 'cool'} href={r.href ?? null} title={r.t} meta={r.m} trailing={r.x} />
	{/each}
	<Btn t="cool" label="Switch into {org.name}" onclick={switchInto} />
</Screen>
