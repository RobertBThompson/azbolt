<script>
	/**
	 * B3 Work — W6 Day & week.
	 * Work and personal blocks stay visually separable, and the filter is a
	 * chip rather than a separate screen. Open blocks are shown so AI can
	 * suggest into them — suggest, never auto-book.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Chips, Row, Note } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Calendar · Chief</title></svelte:head>

<Screen back="/work" nav={false}>
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
</Screen>
