<script>
	/**
	 * B3 Work — W5 Task.
	 * Editing in place rather than opening an edit form. Every row is a 45pt
	 * target and opens a sheet, not a screen.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Chips, Field, Row, Btn } from '$lib/kit';
	import { TASKS } from '$lib/data.js';
	import { page } from '$app/stores';

	const task = $derived(TASKS[$page.params.id ?? ''] ?? TASKS.carmen);
</script>

<svelte:head><title>{task.name} · Chief</title></svelte:head>

<Screen back="/work" nav={false}>
	<Chips t="cool" items={task.tags} />
	<Field label="Task" value={task.name} />
	<Row t="cool" title="When" meta={task.when} trailing="›" />
	<Row t="cool" href="/people/carmen" title="Who" meta={task.who} trailing="↗" />
	<Row t="cool" href="/work/endeavors/website" title="Endeavor" meta={task.endeavor} trailing="›" />
	<Btn t="cool" label="Mark complete" />
</Screen>
