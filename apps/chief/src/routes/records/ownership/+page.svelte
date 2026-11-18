<script>
	/**
	 * Ownership — who holds what.
	 *
	 * Net worth is the first thing on the screen, with room around it
	 * (Robert, 16 Nov). It used to sit under two notices that said the
	 * same thing, an alert and then a red row, about an asset with no
	 * owner. That is worth knowing, but it is not why anyone opens this
	 * screen, so it is said once, at the foot, as the list of what is
	 * held by no one, each one a way to give it an owner.
	 *
	 * Your own figure leads. The other organizations that hold something
	 * follow, each a way into just its links. Yours is not repeated among
	 * them.
	 *
	 * Every link has an owner, something owned, and the terms between
	 * them. Either end can be an organization or an asset — an asset can
	 * hold an asset — but every chain has to end at an organization. The
	 * two lenses are the same links read from either end: Owns gathers
	 * them under whoever holds, Owned by under whatever is held. Each
	 * gathering is a panel with the name large at its top and what the
	 * link is said beside it ("owns 4", "owned by 2"), because the small
	 * capital headings this replaced were the part the eye skipped.
	 *
	 * Owner and Manager stay as two words. A manager runs a thing and
	 * answers for it without holding any of it, and that difference is
	 * the point of recording the role at all.
	 */
	import { book } from '$lib/book.svelte.js';
	import Screen from '$lib/shell/Screen.svelte';
	import { Blank, Btn, Facts, Group, Lead, Row, SectionHead, SourceNote, Tabs } from '$lib/kit';
	import { page } from '$app/stores';
	import {
		ORGS,
		money,
		netWorth,
		netWorthOf,
		nodeName,
		ownershipLinks,
		ownershipTree,
		sharePercent,
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
		/** @type {Map<string, { key: string, cls: string, name: string, links: Link[] }>} */
		const by = new Map();
		for (const l of scoped) {
			const end = active === 0 ? l.owner : l.owned;
			const key = `${end.cls}:${end.id}`;
			if (!by.has(key)) by.set(key, { key, cls: end.cls, name: nodeName(end), links: [] });
			/** @type {{ links: Link[] }} */ (by.get(key)).links.push(l);
		}
		return [...by.values()];
	});

	/** What the panel's links are, from its end: "owns 4 · manages 1".
	 * @param {Link[]} links */
	const caption = (links) => {
		const owners = links.filter((l) => l.role === 'Owner').length;
		const others = links.length - owners;
		const [own, run] = active === 0 ? ['owns', 'manages'] : ['owned by', 'managed by'];
		return [owners ? `${own} ${owners}` : '', others ? `${run} ${others}` : '']
			.filter(Boolean)
			.join(' · ');
	};

	/** @param {Link} l */
	const terms = (l) =>
		[
			l.role,
			sharePercent(l) !== null ? `${sharePercent(l)}%` : null,
			l.role !== 'Owner' ? null : l.currentValue !== null ? money(l.currentValue) : 'needs a value'
		]
			.filter(Boolean)
			.join(' · ');

	/* Decisions 2 and 3: a figure belongs to an organization, and yours is
	   your own organization's. The samples have no "you", so they lead
	   with the total across the tops of every chain instead. */
	const mine = Object.entries(ORGS).find(([, o]) => o.self)?.[0] ?? null;
	const others = worthByOrganization().filter((w) => w.org !== null && w.org !== mine);
	const loose = ownershipTree().loose;
	const scope = $derived(
		org ? (ORGS[org]?.name ?? org) : owned ? nodeName({ cls: 'asset', id: owned }) : ''
	);
</script>

<svelte:head><title>Ownership · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	{#if scope}
		<Btn primary={false} href="/records/ownership" label="Showing {scope} only · Show all" />
	{:else}
		<Lead
			figure={money(mine ? netWorthOf(mine) : netWorth())}
			label={mine ? 'Your net worth' : 'Net worth'}
			meta={mine
				? `What ${ORGS[mine]?.name ?? 'your organization'} holds, by its share`
				: 'Across the top of every chain of ownership'}
		/>
		{#if others.length}
			<SectionHead
				label={mine ? 'Other organizations' : 'By organization'}
				t="warm"
				count={others.length}
			/>
			<!--
				An organization that owns another counts its share of that
				one's worth, not its assets again, so these are not to be
				added together.
			-->
			<Facts
				items={others.map((w) => ({
					label: ORGS[/** @type {string} */ (w.org)]?.name ?? '',
					value: money(w.net),
					href: `/records/ownership?org=${w.org}`
				}))}
			/>
		{/if}
	{/if}

	<Btn t="warm" href="/records/ownership/add" label="Add ownership link" />

	<Tabs items={['Owns', 'Owned by']} {active} onpick={(i) => (active = i)} />

	{#each groups as g (g.key)}
		<Group
			title={g.name}
			caption={caption(g.links)}
			icon={g.cls === 'organization' ? 'people' : 'asset'}
			hue={g.cls === 'organization' ? 'blue' : 'wine'}
		>
			{#each g.links as l (l.id)}
				<Row
					t={l.role === 'Owner' ? 'warm' : 'cool'}
					href="/records/ownership/{l.id}"
					title={active === 0 ? nodeName(l.owned) : nodeName(l.owner)}
					meta={terms(l)}
					trailing="›"
				/>
			{/each}
		</Group>
	{:else}
		<Blank>No ownership links here yet.</Blank>
	{/each}

	{#if !scope && loose.length}
		<SectionHead label="Held by no organization" count={loose.length} />
		{#each loose as a (a.id)}
			<Row
				href="/records/ownership/add?owned={a.id}"
				title={a.name}
				meta="Give it an owner so it counts in net worth"
				trailing="›"
			/>
		{/each}
	{/if}

	<Btn primary={false} href="/records/ownership/tree" label="Ownership tree" />
	<SourceNote source={book.source} error={book.error} />
</Screen>
