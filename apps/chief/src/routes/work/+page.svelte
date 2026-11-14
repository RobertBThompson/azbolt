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
	import { Tabs, Row, Btn, Blank, SourceNote } from '$lib/kit';
	import { TASK_STATES, inOrder, isLate, taskLine } from '$lib/work.js';
	import { work, kept, load } from '$lib/work.svelte.js';

	const LENSES = [
		{ label: 'Tasks', href: '/work', icon: 'task' },
		{ label: 'Endeavors', href: '/work/endeavors', icon: 'action' }
	];

	let active = $state(0);
	const when = $derived(TASK_STATES[active]);
	const list = $derived(inOrder(work.tasks.filter((t) => t.state === when)));
	const tabs = $derived(
		TASK_STATES.map((s) => {
			const n = work.tasks.filter((t) => t.state === s).length;
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
	{#each list as t (t.id)}
		<Row
			t={isLate(t) ? 'alert' : 'cool'}
			href="/work/tasks/{t.id}"
			title={t.name}
			meta={taskLine(t, work.endeavors)}
			trailing="›"
		/>
	{:else}
		{#if work.source !== 'error'}
			<Blank>{EMPTY[/** @type {keyof typeof EMPTY} */ (when)]}</Blank>
		{/if}
	{/each}
	{#if !kept()}
		<Row t="cool" href="/work/calendar" title="Day & week" meta="Calendar view" trailing="›" />
	{/if}
	<Btn t="cool" href="/work/tasks/new" label="New task" />
	<SourceNote source={work.source} error={work.error} onretry={load} />
</Screen>
