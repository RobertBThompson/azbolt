<script>
	/**
	 * B3 Work — W8 Calendar item.
	 * A scheduled task and an external event share the calendar but keep
	 * their identity visible. Removing this block from time never deletes
	 * the task it came from.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Calendar item · Chief</title></svelte:head>

<Screen back="/work/calendar" nav={false}>
	<Banner t="cool" title="Talk to Carmen" meta="Task block · Azbolt" />
	<Row t="cool" title="When" meta="Today · 3:30–3:50 PM" trailing="›" />
	<Row t="cool" title="Calendar" meta="Google Calendar · two-way" trailing="›" />
	<Row t="cool" href="/work/tasks/carmen" title="Linked task" meta="Talk to Carmen" trailing="↗" />
	<Btn t="cool" href="/work/tasks/carmen" label="Open task" />
	<Btn primary={false} href="/work/calendar" label="Remove from calendar" />
</Screen>
