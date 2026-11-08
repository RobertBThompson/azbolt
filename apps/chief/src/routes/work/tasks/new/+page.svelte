<script>
	/**
	 * B3 Work — W7 New task.
	 * Quick Jot remains the fastest route; this manual screen exists for
	 * deliberate entry. Only the task is required, and context is
	 * pre-filled from the shell rather than asked again.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>New task · Chief</title></svelte:head>

<Screen back="/work" nav={false}>
	<Field label="Task" placeholder="What needs to happen" />
	<Row t="cool" title="Context" meta="Azbolt · from the active sphere" trailing="›" />
	<Row t="cool" title="When" meta="No date yet" trailing="›" />
	<Row t="cool" href="/people" title="Who" meta="Unassigned" trailing="↗" />
	<Row t="cool" href="/work/endeavors" title="Endeavor" meta="Not linked" trailing="›" />
	<Btn t="cool" label="Create task" />
</Screen>
