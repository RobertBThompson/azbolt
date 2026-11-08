<script>
	/**
	 * B3 Work — W9 Open work blocks.
	 * Availability is a decision surface, not an automation. Chief may rank
	 * useful openings, but it cannot put work into one until the user
	 * selects both a block and a task.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Open blocks · Chief</title></svelte:head>

<Screen back="/work/calendar" nav={false}>
	<Banner t="cool" title="3 openings this week" meta="Suggestions only. Nothing has been booked." />
	<Row t="cool" title="Tuesday · 10:00–10:45" meta="No conflicts · work hours" trailing="›" />
	<Row t="cool" title="Tuesday · 2:15–3:00" meta="Before Carmen call" trailing="›" />
	<Row t="cool" title="Wednesday · 9:00–10:00" meta="Longest open block" trailing="›" />
	<Btn t="cool" label="Choose a task for a block" />
	<Note>Chief never auto-books, even when confidence is high.</Note>
</Screen>
