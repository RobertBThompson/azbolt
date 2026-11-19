<script>
	/**
	 * Asset — what you hold, where it stands, and the work that builds it
	 * (Robert, 19 Nov 2026).
	 *
	 * The Chief cares about two things here: status and activity. Not a
	 * list of assets; that is a door away when it is wanted. So the page
	 * opens on a switch, and each position answers the questions the
	 * Chief brings to it:
	 *
	 *   Focus     Where do I put my focus, and what comes first? Let me see
	 *             the assets, to think how to build them and the
	 *             organizations they belong to.
	 *   Work      What do I need to work on to build their value and
	 *             worth? Which are the quick wins, and which give the most
	 *             for the effort?
	 *   Activity  What have my assets been doing, and what work moved them?
	 *   Worth     What are they worth, what is owed, and what is each
	 *             organization worth?
	 *
	 * Assets are Now, Soon, Later or Done, like tasks, and the sphere at
	 * the top already narrows them. Focus has the same four tabs as the
	 * Action tab, so the two read alike, and opens on Now. The tab is
	 * kept in the address, so coming back from an asset returns to it.
	 * Moving many assets at once is its own screen, a tap away.
	 * Money is a category like any other, reached from the categories at
	 * the foot of Focus and from Worth; Ownership from Worth.
	 *
	 * The work is the Action tab's tasks. A task may name the asset it
	 * works on, a rough effort and a gain in dollars, and it reaches a
	 * sphere through its endeavor, here as on the Action tab. What happens
	 * to an asset reaches a sphere through whoever owns the asset.
	 */
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { book } from '$lib/book.svelte.js';
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import {
		Blank,
		Btn,
		Facts,
		FocusNote,
		Lead,
		Row,
		SectionHead,
		SourceNote,
		Tabs,
		Tiles
	} from '$lib/kit';
	import {
		ASSETS,
		ASSET_CATEGORIES,
		ASSET_STATES,
		ORGS,
		assetValue,
		controllingOrgs,
		dayLabel,
		effectiveValue,
		events,
		isMoneyCategory,
		money,
		moneyAssets,
		netWorth,
		netWorthOf,
		owedMonthly,
		owedTotal,
		ownershipLinks,
		ownershipTree,
		stateOf,
		worthByOrganization
	} from '$lib/assets.js';
	import { inFocus } from '$lib/spheres.svelte.js';
	import { work } from '$lib/work.svelte.js';
	import { dateOf, rankWork, spheresOf } from '$lib/work.js';

	const LENSES = [
		{ label: 'Focus', href: '/records', icon: 'globe' },
		{ label: 'Work', href: '/records?view=work', icon: 'action' },
		{ label: 'Activity', href: '/records?view=activity', icon: 'dash' },
		{ label: 'Worth', href: '/records?view=worth', icon: 'cash' }
	];
	const view = $derived(
		['work', 'activity', 'worth'].includes($page.url.searchParams.get('view') ?? '')
			? /** @type {string} */ ($page.url.searchParams.get('view'))
			: 'focus'
	);
	const at = $derived(view === 'focus' ? '/records' : `/records?view=${view}`);

	/** @param {number} n @param {string} one @param {string} [many] */
	const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

	/* ── Focus ──────────────────────────────────────────────────────── */

	/** @typedef {import('$lib/assets.js').AssetRow} AssetRow */
	const all = /** @type {AssetRow[]} */ (Object.entries(ASSETS).map(([id, a]) => ({ id, ...a })));
	const held = all.filter((a) => stateOf(a) !== 'Done');
	const seen = $derived(inFocus(all, (a) => a.spheres));
	const hidden = $derived(held.length - seen.filter((x) => stateOf(x.item) !== 'Done').length);

	const standing = $derived(
		ASSET_STATES.find((s) => s.toLowerCase() === $page.url.searchParams.get('state')) ?? 'Now'
	);
	/** @param {number} i */
	const stand = (i) =>
		goto(i ? `/records?state=${ASSET_STATES[i].toLowerCase()}` : '/records', {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	const inTab = $derived(seen.filter((x) => stateOf(x.item) === standing));
	const tabValue = $derived(inTab.reduce((n, x) => n + (effectiveValue(x.item) ?? 0), 0));
	const tabs = $derived(
		ASSET_STATES.map((s) => {
			const n = seen.filter((x) => stateOf(x.item) === s).length;
			return s === 'Done' || !n ? s : `${s} ${n}`;
		})
	);
	/** What each tab is, under the figure. */
	const MEANS = /** @type {Record<string, string>} */ ({
		Now: 'The focus',
		Soon: 'Next in line',
		Later: 'On the back burner'
	});
	const EMPTY = /** @type {Record<string, string>} */ ({
		Now: 'Nothing is Now. Open an asset and set it to Now, or move several at once.',
		Soon: 'Nothing is waiting in Soon.',
		Later: 'Nothing is on the back burner.',
		Done: 'Nothing has been let go. An asset sold, given away or lost is recorded on its own page, and stays here as a record.'
	});

	/** @param {string} id */
	const openOn = (id) => work.tasks.filter((t) => t.asset === id && t.state !== 'Done').length;

	/** Who it belongs to, and the work waiting on it. @param {AssetRow} a */
	const assetLine = (a) => {
		const owners = controllingOrgs(a.id)
			.map((o) => ORGS[o]?.name)
			.filter(Boolean);
		const open = openOn(a.id);
		return [
			owners.length ? owners.join(', ') : 'No owner yet',
			open ? count(open, 'open task') : ''
		]
			.filter(Boolean)
			.join(' · ');
	};
	/** @param {AssetRow} a */
	const valueOf = (a) => {
		const v = effectiveValue(a);
		return v === null ? '—' : money(v);
	};

	/* Categories as places to look, counting what is in view and held. */
	const categories = $derived(
		ASSET_CATEGORIES.map((c) => {
			const inIt = seen
				.map((x) => x.item)
				.filter((a) => a.category === c.id && stateOf(a) !== 'Done');
			return {
				...c,
				n: inIt.length,
				value: inIt.reduce((sum, a) => sum + (effectiveValue(a) ?? 0), 0)
			};
		}).filter((c) => c.n || isMoneyCategory(c.id))
	);

	/* ── Work ───────────────────────────────────────────────────────── */

	/** @param {import('$lib/work.js').Task} t */
	const taskSpheres = (t) =>
		spheresOf(
			work.endeavors.find((e) => e.id === t.endeavor),
			work.orgs
		);
	const tasksSeen = $derived(inFocus(work.tasks, taskSpheres).map((x) => x.item));
	const ranked = $derived(rankWork(tasksSeen));
	const toGain = $derived([...ranked.quick, ...ranked.best].reduce((n, t) => n + t.gain, 0));

	/** @param {import('$lib/work.js').Task} t */
	const workLine = (t) =>
		[ASSETS[t.asset]?.name, t.effort ? `${t.effort.toLowerCase()} effort` : '', t.state]
			.filter(Boolean)
			.join(' · ');

	/* ── Activity ───────────────────────────────────────────────────── */

	const feed = $derived.by(() => {
		const happened = events().map((e, i) => ({
			key: `e${i}`,
			date: e.date,
			title: `${e.type} · ${e.name}`,
			meta: e.detail,
			when: e.when,
			href: `/records/assets/${e.asset}`,
			spheres: ASSETS[e.asset]?.spheres ?? []
		}));
		const worked = work.tasks
			.filter((t) => t.state === 'Done' && t.asset && t.doneOn)
			.map((t) => ({
				key: `t${t.id}`,
				date: dateOf(t.doneOn),
				title: `Done · ${t.name}`,
				meta: ASSETS[t.asset]?.name ?? '',
				when: dayLabel(dateOf(t.doneOn)),
				href: `/work/tasks/${t.id}`,
				spheres: taskSpheres(t)
			}));
		return inFocus(
			[...happened, ...worked].sort((a, b) => b.date.getTime() - a.date.getTime()),
			(x) => x.spheres
		);
	});

	/* ── Worth ──────────────────────────────────────────────────────── */

	/* Decisions 2 and 3: a figure belongs to an organization, and yours is
	   your own organization's. The samples have no "you", so they lead
	   with the total across the tops of every chain instead. */
	const mine = Object.entries(ORGS).find(([, o]) => o.self)?.[0] ?? null;
	const others = worthByOrganization().filter((w) => w.org !== null && w.org !== mine);
	const inAccounts = moneyAssets().reduce((n, a) => n + (a.value ?? 0), 0);
	const loose = ownershipTree().loose.length;
</script>

<svelte:head><title>Asset · Chief</title></svelte:head>

<Screen>
	<LensSwitch label="Asset view" items={LENSES} {at} />

	{#if view === 'focus'}
		<FocusNote quiet={seen.filter((x) => x.quiet).length} {hidden} what="assets" />
		<Tabs items={tabs} active={ASSET_STATES.indexOf(standing)} onpick={stand} />
		{#if standing !== 'Done' && inTab.length}
			<Lead
				figure={money(tabValue)}
				label="{count(inTab.length, 'asset')} {standing.toLowerCase()}"
				meta={MEANS[standing]}
			/>
		{/if}
		<Btn t="warm" href="/records/assets/new" label="Add asset" />
		{#if held.length}
			<Btn primary={false} href="/records/focus" label="Move assets between Now, Soon and Later" />
		{/if}

		{#each inTab as { item: a, quiet } (a.id)}
			{#if standing === 'Done'}
				<Row href="/records/assets/{a.id}" title={a.name} meta="Let go · kept as a record" quiet />
			{:else}
				<Row
					t="warm"
					href="/records/assets/{a.id}"
					title={a.name}
					meta={assetLine(a)}
					trailing={valueOf(a)}
					{quiet}
				/>
			{/if}
		{:else}
			<Blank>{EMPTY[standing]}</Blank>
		{/each}

		{#if categories.length && standing !== 'Done'}
			<SectionHead label="Categories" t="warm" count={categories.length} />
			<Tiles
				label="Categories"
				items={categories.map((c) => ({
					key: c.id,
					href: isMoneyCategory(c.id) ? '/records/money' : `/records/assets/in/${c.id}`,
					title: c.name,
					value: c.value ? money(c.value) : '',
					line: count(c.n, 'asset')
				}))}
			/>
			<Btn primary={false} href="/records/assets" label="All categories" />
		{/if}
	{:else if view === 'work'}
		{#if toGain}
			<Lead
				figure="+{money(toGain)}"
				label="To gain from {count(ranked.quick.length + ranked.best.length, 'task')} on assets"
				meta="{count(ranked.quick.length, 'quick win')} among them"
			/>
		{/if}
		<Btn t="cool" href="/work/tasks/new" label="New task" />

		{#if ranked.quick.length}
			<SectionHead label="Quick wins" t="cool" count={ranked.quick.length} />
			{#each ranked.quick as t (t.id)}
				<Row
					t="cool"
					href="/work/tasks/{t.id}"
					title={t.name}
					meta={workLine(t)}
					trailing="+{money(t.gain)}"
				/>
			{/each}
		{/if}
		{#if ranked.best.length}
			<SectionHead label="Most for the effort" t="cool" count={ranked.best.length} />
			{#each ranked.best as t (t.id)}
				<Row
					t="cool"
					href="/work/tasks/{t.id}"
					title={t.name}
					meta={workLine(t)}
					trailing="+{money(t.gain)}"
				/>
			{/each}
		{/if}
		{#if ranked.unsized.length}
			<SectionHead label="Not sized yet" count={ranked.unsized.length} />
			{#each ranked.unsized as t (t.id)}
				<Row
					href="/work/tasks/{t.id}"
					title={t.name}
					meta="{ASSETS[t.asset]?.name ?? ''} · give it an effort and a gain"
					trailing="›"
				/>
			{/each}
		{/if}
		{#if !ranked.quick.length && !ranked.best.length && !ranked.unsized.length}
			<Blank>
				No open work on an asset yet. A task can name the asset it works on, how much effort it
				takes, and what it should add; then it is ranked here.
			</Blank>
		{:else}
			<Blank>
				Quick wins are small tasks, largest gain first. The rest rank by gain for the effort: medium
				counts as twice a small task, large as four times.
			</Blank>
		{/if}
	{:else if view === 'activity'}
		{#each feed as { item: e, quiet } (e.key)}
			<Row t="warm" href={e.href} title={e.title} meta={e.meta} trailing={e.when} {quiet} />
		{:else}
			<Blank>
				Nothing has happened yet. Values, moves, upkeep, letting go, and tasks done on an asset show
				here as they happen.
			</Blank>
		{/each}
		<Btn primary={false} href="/records/activity" label="Every event, by kind" />
	{:else}
		<Lead
			figure={money(mine ? netWorthOf(mine) : netWorth())}
			label={mine ? 'Your net worth' : 'Net worth'}
			meta={mine
				? `What ${ORGS[mine]?.name ?? 'your organization'} holds, by its share`
				: 'Across the top of every chain of ownership'}
		/>
		<Facts
			items={[
				{ label: 'Assets held', value: money(assetValue()), href: '/records/assets' },
				{ label: 'Of that, in money accounts', value: money(inAccounts), href: '/records/money' },
				{ label: 'Still owed', value: money(owedTotal()), href: '/records/money/liabilities' },
				{ label: 'Owed a month', value: money(owedMonthly()) }
			]}
		/>
		{#if others.length}
			<SectionHead
				label={mine ? 'Other organizations' : 'By organization'}
				t="warm"
				count={others.length}
			/>
			<Facts
				items={others.map((w) => ({
					label: ORGS[/** @type {string} */ (w.org)]?.name ?? '',
					value: money(w.net),
					href: `/records/ownership?org=${w.org}`
				}))}
			/>
		{/if}
		<SectionHead label="Ownership" t="warm" />
		<Row
			t="warm"
			icon="people"
			hue="blue"
			href="/records/ownership"
			title="Who holds what"
			meta="{count(ownershipLinks().length, 'link')}{loose
				? ` · ${count(loose, 'asset')} with no owner`
				: ''}"
			trailing="›"
		/>
	{/if}

	<SourceNote source={book.source} error={book.error} />
</Screen>
