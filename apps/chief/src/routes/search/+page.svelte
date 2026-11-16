<script>
	/**
	 * F0 Shell — SH2 Global search.
	 * Search is a shell affordance, not a tab. Results carry their kind,
	 * so a result never lands you somewhere unlabelled.
	 *
	 * It searches what is kept: people, organizations, assets,
	 * liabilities, tasks, endeavors and jots waiting to be sphered. Notes
	 * and documents live on this device and are not searched from here.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Field, Tabs, Row, Note, Blank, SourceNote } from '$lib/kit';
	import {
		LIABILITIES,
		activeAssets,
		amountOrAsk,
		categoryName,
		effectiveValue,
		money
	} from '$lib/assets.js';
	import { jots } from '$lib/jots.svelte.js';
	import { find } from '$lib/search.js';
	import { taskLine } from '$lib/work.js';
	import { work, orgOf } from '$lib/work.svelte.js';

	let { data } = $props();

	const GROUPS = ['All', 'People', 'Work', 'Assets'];
	let query = $state('');
	let active = $state(0);

	const items = $derived.by(() => {
		/** @type {import('$lib/search.js').Findable[]} */
		const all = [];
		for (const p of data.people.data) {
			all.push({
				kind: 'Person',
				group: 'People',
				href: `/people/${p.id}`,
				title: p.name,
				meta: p.meta ?? ''
			});
		}
		for (const o of work.orgs) {
			all.push({
				kind: 'Organization',
				group: 'People',
				href: `/organizations/${o.id}`,
				title: o.name,
				meta: o.self ? 'You' : o.code
			});
		}
		for (const a of activeAssets()) {
			all.push({
				kind: 'Asset',
				group: 'Assets',
				href: `/records/assets/${a.id}`,
				title: a.name,
				meta: `${categoryName(a.category)} · ${amountOrAsk(effectiveValue(a))}`,
				text: `${a.blurb} ${a.notes} ${a.storage}`
			});
		}
		for (const [id, l] of Object.entries(LIABILITIES)) {
			all.push({
				kind: 'Liability',
				group: 'Assets',
				href: `/records/money/liabilities/${id}`,
				title: l.name,
				meta: `${l.type} · ${money(l.balance)} left`
			});
		}
		for (const e of work.endeavors) {
			all.push({
				kind: 'Endeavor',
				group: 'Work',
				href: `/work/endeavors/${e.id}`,
				title: e.name,
				meta: [orgOf(e.organization)?.name, e.stage].filter(Boolean).join(' · '),
				text: e.outcome
			});
		}
		for (const t of work.tasks) {
			all.push({
				kind: 'Task',
				group: 'Work',
				href: `/work/tasks/${t.id}`,
				title: t.name,
				meta: [t.state, taskLine(t, work.endeavors)].filter(Boolean).join(' · '),
				text: t.notes
			});
		}
		for (const j of jots.list) {
			if (j.state !== 'kept') continue;
			all.push({
				kind: 'Jot',
				group: 'Work',
				href: `/jot/${j.id}/sphere`,
				title: j.text,
				meta: `thrown ${j.thrown}`
			});
		}
		return all;
	});

	const results = $derived(find(items, query, GROUPS[active]));
	const source = $derived(data.people.source === 'error' ? 'error' : work.source);
</script>

<svelte:head><title>Search · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Field label="Search" placeholder="People, work, assets" bind:value={query} />
	<Tabs items={GROUPS} {active} onpick={(i) => (active = i)} />
	{#each results.slice(0, 40) as r (r.href)}
		<Row href={r.href} title={r.title} meta="{r.kind}{r.meta ? ` · ${r.meta}` : ''}" trailing="↗" />
	{:else}
		{#if query.trim()}
			<Blank>
				Nothing matches{active ? ` under ${GROUPS[active]}` : ''}. Every word has to be found in the
				same record.
			</Blank>
		{/if}
	{/each}
	{#if results.length > 40}
		<Note>Showing the first 40 of {results.length}. Add a word to narrow it.</Note>
	{/if}
	{#if !query.trim()}
		<Note>
			Searches {items.length}
			{items.length === 1 ? 'record' : 'records'}: people, organizations, assets, liabilities,
			tasks, endeavors and jots. Notes and documents are kept on this device and are not searched
			from here.
		</Note>
	{/if}
	<SourceNote {source} error={work.error} />
</Screen>
