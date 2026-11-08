<script>
	/**
	 * B3 Work & Calendar — W4 Work queue.
	 * A mobile list beats three narrow Kanban columns. "Waiting" is a
	 * first-class tab because blocked work is what people lose track of.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Banner, Row, Btn } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Work · Chief</title></svelte:head>

<Screen>
	<Tabs items={['Now', 'Next', 'Waiting', 'Done']} {active} onpick={(i) => (active = i)} />
	<Banner t="ai" title="2 items placed by AI" meta="Approved from your last jot." />
	<Row
		t="cool"
		href="/work/tasks/carmen"
		title="Talk to Carmen"
		meta="3:30 PM · Azbolt"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/work/tasks/homepage"
		title="Approve homepage"
		meta="4:00 PM · Website launch"
		trailing="›"
	/>
	<Row t="cool" title="Review storage process" meta="Waiting on Daniel · 4 days" trailing="›" />
	<Row t="cool" href="/work/endeavors" title="Endeavors" meta="3 active" trailing="›" />
	<Row t="cool" href="/work/calendar" title="Day & week" meta="Calendar view" trailing="›" />
	<Btn primary={false} href="/work/tasks/new" label="New task" />
</Screen>
