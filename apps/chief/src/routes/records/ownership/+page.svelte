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
	import { Alert, Blank, Btn, Row, SectionHead, SourceNote, Stats, Tabs } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { page } from '$app/stores';
	import {
		ownershipLinks,
		money,
		nodeName,
		ownershipTree,
		sharePercent,
		short,
		worthByOrganization
	} from '$lib/assets.js';

	/** Arriving from an organization or an asset narrows the view to it. */
	const org = $derived($page.url.searchParams.get('org'));
	const owned = $derived($page.url.searchParams.get('owned'));
	let active = $state($page.url.searchParams.get('owned') ? 1 : 0);

	const scoped = $derived(
		ownershipLinks().filter((l) => {
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
			sharePercent(l) !== null ? `${sharePercent(l)}%` : null,
			l.role !== 'Owner' ? null : l.currentValue !== null ? money(l.currentValue) : 'needs a value'
		]
			.filter(Boolean)
			.join(' · ');

	const loose = ownershipTree().loose;
	const worth = worthByOrganization();
	/** @type {[string, string][]} */
	const worthStats = worth
		.slice(0, 3)
		.map((w) => [short(w.net), w.org === null ? 'No organization' : (ORGS[w.org]?.name ?? '')]);
	const worthRest = worth.length - worthStats.length;
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
		<!--
			An organization that owns another counts its share of that
			one's worth, not its assets again, so these do not add up to
			more than there is.
		-->
		{#if worthRest > 0}
			<Blank
				>{worthRest} more {worthRest === 1 ? 'organization' : 'organizations'} hold something. A figure
				here counts only what that organization owns, by its share.</Blank
			>
		{/if}
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
