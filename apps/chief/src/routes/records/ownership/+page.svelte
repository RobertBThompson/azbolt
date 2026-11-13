<script>
	/**
	 * Ownership — who holds what.
	 *
	 * Every row is one link: an owner, something owned, and the terms
	 * between them. Either end can be an organization or an asset — an
	 * asset can hold an asset — but every chain has to end at an
	 * organization, and one that does not is named at the top rather than
	 * left to be found.
	 *
	 * The two lenses are the same links read from either end: Owns groups
	 * them under whoever holds, Owned by under whatever is held.
	 *
	 * Owner and Manager stay as two words. A manager runs a thing and
	 * answers for it without holding any of it, and that difference is
	 * the point of recording the role at all.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Row, Alert, Btn, SectionHead, Stats, SourceNote, Blank } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { page } from '$app/stores';
	import {
		LINKS,
		money,
		nodeName,
		ownershipTree,
		short,
		worthByOrganization
	} from '$lib/assets.js';

	/** Arriving from an organization or an asset narrows the view to it. */
	const org = $derived($page.url.searchParams.get('org'));
	const owned = $derived($page.url.searchParams.get('owned'));
	let active = $state($page.url.searchParams.get('owned') ? 1 : 0);

	const scoped = $derived(
		LINKS.filter((l) => {
			if (org) return l.owner.id === org || l.owned.id === org;
			if (owned) return l.owned.id === owned;
			return true;
		})
	);

	/** @typedef {import('$lib/assets.js').Link} Link */

	/** The same links, gathered under one end or the other. */
	const groups = $derived.by(() => {
		/** @type {Map<string, { name: string, links: Link[] }>} */
		const by = new Map();
		for (const l of scoped) {
			const end = active === 0 ? l.owner : l.owned;
			const key = `${end.cls}:${end.id}`;
			if (!by.has(key)) by.set(key, { name: nodeName(end), links: [] });
			/** @type {{ name: string, links: Link[] }} */ (by.get(key)).links.push(l);
		}
		return [...by.values()];
	});

	/** @param {Link} l */
	const terms = (l) =>
		[
			l.role,
			l.shares !== null ? `${l.shares}%` : null,
			l.currentValue !== null ? money(l.currentValue) : null
		]
			.filter(Boolean)
			.join(' · ');

	const loose = ownershipTree().loose;
	/** @type {[string, string][]} */
	const worthStats = worthByOrganization()
		.filter((w) => w.org !== null)
		.slice(0, 3)
		.map((w) => [short(w.net), ORGS[w.org ?? '']?.name ?? '']);
	const scope = $derived(
		org ? (ORGS[org]?.name ?? org) : owned ? nodeName({ cls: 'asset', id: owned }) : ''
	);
</script>

<svelte:head><title>Ownership · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	{#if !scope && loose.length}
		<Alert
			title="{loose.length} {loose.length === 1 ? 'asset has' : 'assets have'} no owner"
			meta="{loose.map((a) => a.name).join(', ')}. Every asset has to end up with an organization."
		/>
		{#each loose as a (a.id)}
			<Row
				t="alert"
				href="/records/ownership/add?owned={a.id}"
				title="Give {a.name} an owner"
				meta="Link it to the organization that holds it"
				trailing="›"
			/>
		{/each}
	{/if}

	{#if scope}
		<Row
			href="/records/ownership"
			title="Showing {scope} only"
			meta="Open the whole ownership view"
			trailing="×"
			dot={false}
		/>
	{:else}
		<SectionHead label="Net worth by organization" t="warm" />
		<Stats items={worthStats} />
	{/if}

	<Tabs items={['Owns', 'Owned by']} {active} onpick={(i) => (active = i)} />

	{#each groups as g (g.name)}
		<SectionHead label={g.name} t="warm" count={g.links.length} />
		{#each g.links as l (l.id)}
			<Row
				t={l.role === 'Owner' ? 'warm' : 'cool'}
				href="/records/ownership/{l.id}"
				title={active === 0 ? nodeName(l.owned) : nodeName(l.owner)}
				meta={terms(l)}
				trailing="›"
			/>
		{/each}
	{:else}
		<Blank>No ownership links here yet.</Blank>
	{/each}

	<Btn t="warm" href="/records/ownership/add" label="Add ownership link" />
	<Btn primary={false} href="/records/ownership/tree" label="Ownership tree" />
	<SourceNote source="fixture" />
</Screen>
