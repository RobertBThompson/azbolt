<script>
	/**
	 * B3 Work — W6 Day & week.
	 *
	 * Signed in, this is what is already on record with a date: open
	 * tasks, and payments due on liabilities, laid out by when they
	 * fall. Chief keeps no appointments and reads no outside calendar,
	 * and says so rather than show blocks it did not put there.
	 *
	 * Signed out it is the design, with sample appointments.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Blank, Btn, Chips, Note, Row, SectionHead, SourceNote, Tabs } from '$lib/kit';
	import { LIABILITIES, ORGS, money, nextDue, ownBook } from '$lib/assets.js';
	import { byStretch, datedTasks, dayOf } from '$lib/calendar.js';
	import { inFocus } from '$lib/spheres.svelte.js';
	import { spheresOf } from '$lib/work.js';
	import { work, kept, load } from '$lib/work.svelte.js';

	let active = $state(0);

	/* Through the sphere in focus, like the task list itself. */
	const tasks = $derived(
		inFocus(work.tasks, (t) =>
			spheresOf(
				work.endeavors.find((e) => e.id === t.endeavor),
				work.orgs
			)
		).map((x) => x.item)
	);
	const undated = $derived(tasks.filter((t) => t.state !== 'Done' && !t.due).length);

	const payments = $derived(
		ownBook()
			? Object.entries(LIABILITIES)
					.filter(([, l]) => l.payment > 0 && l.balance > 0)
					.map(([id, l]) => {
						const date = nextDue(l);
						return {
							date,
							title: `${l.name} · ${money(l.payment)}`,
							meta: `Payment due · ${ORGS[l.borrower]?.name ?? ''}`,
							href: `/records/money/liabilities/${id}`,
							kind: /** @type {'Payment'} */ ('Payment'),
							late: false
						};
					})
			: []
	);
	const stretches = $derived(byStretch([...datedTasks(tasks, work.endeavors), ...payments]));
</script>

<svelte:head><title>Calendar · Chief</title></svelte:head>

<Screen back="/work" nav={false}>
	{#if kept()}
		{#each stretches as s (s.label)}
			<SectionHead label={s.label} t={s.late ? 'alert' : 'cool'} count={s.items.length} />
			{#each s.items as line (line.href)}
				<Row
					t={s.late ? 'alert' : line.kind === 'Payment' ? 'warm' : 'cool'}
					href={line.href}
					title={line.title}
					meta={line.meta}
					trailing={s.label === 'Today' || s.label === 'Tomorrow' ? '›' : dayOf(line.date)}
				/>
			{/each}
		{:else}
			{#if work.source !== 'error'}
				<Blank>Nothing with a date. Give a task a due date and it appears here.</Blank>
			{/if}
		{/each}
		{#if undated}
			<Row
				t="cool"
				href="/work"
				title="{undated} open {undated === 1 ? 'task has' : 'tasks have'} no date"
				meta="In the task list"
				trailing="›"
			/>
		{/if}
		<Btn t="cool" href="/work/tasks/new" label="New task" />
		<Note>
			Tasks with a due date and payments due on what you owe. Chief keeps no appointments and is not
			connected to an outside calendar.
		</Note>
		<SourceNote source={work.source} error={work.error} onretry={load} />
	{:else}
		<Tabs items={['Day', 'Week', 'Month']} {active} onpick={(i) => (active = i)} />
		<Chips t="cool" items={['All', 'Work', 'Personal']} />
		<Row
			t="cool"
			href="/work/calendar/carmen"
			title="3:30 PM · Talk to Carmen"
			meta="Work · Azbolt"
			trailing="›"
		/>
		<Row
			t="cool"
			href="/work/calendar/daughter"
			title="7:00 PM · Call my daughter"
			meta="Personal"
			trailing="›"
		/>
		<Row
			t="cool"
			href="/work/calendar/open"
			title="3 open work blocks"
			meta="Chief may suggest; it never books"
			trailing="›"
		/>
		<Note>Google Calendar is two-way. External events are shown but not editable here.</Note>
		<SourceNote source="fixture" />
	{/if}
</Screen>
