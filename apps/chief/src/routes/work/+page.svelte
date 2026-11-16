<script>
	/**
	 * B3 Work & Calendar — W4 Work queue.
	 * A mobile list beats three narrow Kanban columns.
	 *
	 * Decision 8: a task is Now, Soon, Later or Done. Waiting is not a
	 * fifth pile — a task being waited on is still a Now or a Soon, and
	 * says on whom in its own line, so blocked work stays in the list it
	 * belongs to instead of out of sight.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Tabs, Row, Btn, Blank, FocusNote, SourceNote } from '$lib/kit';
	import { inFocus, outOfView } from '$lib/spheres.svelte.js';
	import { TASK_STATES, inOrder, isLate, spheresOf, taskLine } from '$lib/work.js';
	import { work, kept, load } from '$lib/work.svelte.js';

	const LENSES = [
		{ label: 'Tasks', href: '/work', icon: 'task' },
		{ label: 'Endeavors', href: '/work/endeavors', icon: 'action' }
	];

	let active = $state(0);
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

<Screen>
	<LensSwitch label="Action view" items={LENSES} at="/work" />
	<Tabs items={tabs} {active} onpick={(i) => (active = i)} />
	<FocusNote
		what="tasks here"
		quiet={list.filter((x) => x.quiet).length}
		hidden={outOfView(inState, taskSpheres)}
	/>
	{#each list as { item: t, quiet } (t.id)}
		<Row
			t={isLate(t) ? 'alert' : 'cool'}
			href="/work/tasks/{t.id}"
			title={t.name}
			meta={taskLine(t, work.endeavors)}
			trailing="›"
			{quiet}
		/>
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
