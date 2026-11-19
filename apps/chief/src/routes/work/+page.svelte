<script>
	/**
	 * B3 Work & Calendar — W4 Work queue.
	 * A mobile list beats three narrow Kanban columns.
	 *
	 * Decision 8: a task is Now, Soon, Later or Done. Waiting is not a
	 * fifth pile — a task being waited on is still a Now or a Soon, and
	 * says on whom in its own line, so blocked work stays in the list it
	 * belongs to instead of out of sight.
	 *
	 * Each task is shown under the endeavor it belongs to, the objective
	 * under its goal (Robert, 19 Nov). The endeavor heads a panel with its
	 * organization and how far along it is; the group with the most
	 * pressing task leads. Every sphere starts with an endeavor to build
	 * it, so most tasks have one; those that do not come last.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Tabs, Row, Btn, Blank, FocusNote, Group, SectionHead, SourceNote } from '$lib/kit';
	import { ASSETS } from '$lib/assets.js';
	import { inFocus, outOfView } from '$lib/spheres.svelte.js';
	import {
		TASK_STATES,
		byEndeavor,
		inOrder,
		isLate,
		progressOf,
		spheresOf,
		taskLine
	} from '$lib/work.js';
	import { work, kept, load, orgOf } from '$lib/work.svelte.js';

	const LENSES = [
		{ label: 'Tasks', href: '/work', icon: 'task' },
		{ label: 'Endeavors', href: '/work/endeavors', icon: 'action' }
	];

	/* The tab is kept in the address, so coming back from a task
	   returns to the tab it was opened from. */
	const active = $derived(
		Math.max(
			0,
			TASK_STATES.findIndex((s) => s.toLowerCase() === $page.url.searchParams.get('state'))
		)
	);
	/** @param {number} i */
	const pick = (i) =>
		goto(i ? `/work?state=${TASK_STATES[i].toLowerCase()}` : '/work', {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	const when = $derived(TASK_STATES[active]);
	/* A task is in the spheres of its endeavor's organization, and
	   nowhere else. */
	/** @param {import('$lib/work.js').Task} t */
	const taskSpheres = (t) =>
		spheresOf(
			work.endeavors.find((e) => e.id === t.endeavor),
			work.orgs
		);
	const inState = $derived(inOrder(work.tasks.filter((t) => t.state === when)));
	const list = $derived(inFocus(inState, taskSpheres));
	const groups = $derived.by(() => {
		const quiet = new Set(list.filter((x) => x.quiet).map((x) => x.item.id));
		return byEndeavor(
			list.map((x) => x.item),
			work.endeavors
		).map((g) => ({ ...g, rows: g.tasks.map((t) => ({ t, quiet: quiet.has(t.id) })) }));
	});

	/** Under its endeavor, a task's line need not name the endeavor again; it names the asset.
	 * @param {import('$lib/work.js').Task} t */
	const line = (t) =>
		[taskLine(t, []), t.asset ? ASSETS[t.asset]?.name : ''].filter(Boolean).join(' · ');

	/** @param {import('$lib/work.js').Endeavor} e */
	const caption = (e) => {
		const p = progressOf(e.id, work.tasks);
		return [orgOf(e.organization)?.name ?? '', p.total ? `${p.done} of ${p.total} done` : '']
			.filter(Boolean)
			.join(' · ');
	};
	const tabs = $derived(
		TASK_STATES.map((s) => {
			const n = inFocus(
				work.tasks.filter((t) => t.state === s),
				taskSpheres
			).length;
			return s === 'Done' || !n ? s : `${s} ${n}`;
		})
	);

	const EMPTY = {
		Now: 'Nothing to do now.',
		Soon: 'Nothing lined up for soon.',
		Later: 'Nothing put off for later.',
		Done: 'Nothing done yet.'
	};
</script>

<svelte:head><title>Work · Chief</title></svelte:head>

{#snippet task(/** @type {import('$lib/work.js').Task} */ t, /** @type {boolean} */ quiet)}
	<Row
		t={isLate(t) ? 'alert' : 'cool'}
		href="/work/tasks/{t.id}"
		title={t.name}
		meta={line(t)}
		trailing="›"
		{quiet}
	/>
{/snippet}

<Screen>
	<LensSwitch label="Action view" items={LENSES} at="/work" />
	<Tabs items={tabs} {active} onpick={pick} />
	<FocusNote
		what="tasks here"
		quiet={list.filter((x) => x.quiet).length}
		hidden={outOfView(inState, taskSpheres)}
	/>
	{#each groups as g (g.endeavor?.id ?? '')}
		{#if g.endeavor}
			<Group title={g.endeavor.name} caption={caption(g.endeavor)} icon="action" hue="blue">
				{#each g.rows as { t, quiet } (t.id)}
					{@render task(t, quiet)}
				{/each}
			</Group>
		{:else}
			<SectionHead label="Not part of an endeavor" count={g.rows.length} />
			{#each g.rows as { t, quiet } (t.id)}
				{@render task(t, quiet)}
			{/each}
		{/if}
	{:else}
		{#if work.source !== 'error'}
			<Blank>{EMPTY[/** @type {keyof typeof EMPTY} */ (when)]}</Blank>
		{/if}
	{/each}

	<Row
		t="cool"
		href="/work/calendar"
		title="By date"
		meta={kept() ? 'Dated tasks and payments due' : 'Calendar view'}
		trailing="›"
	/>
	<Btn t="cool" href="/work/tasks/new" label="New task" />
	<SourceNote source={work.source} error={work.error} onretry={load} />
</Screen>
