<script>
	/**
	 * F2 Capture — Q9 Placement history.
	 * Grouped by what happened to the proposal, not by date. "Changed" is the
	 * most useful tab because it is where the model's blind spots show up.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Row, Btn } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Placement history · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Tabs items={['Approved', 'Changed', 'Undone']} {active} onpick={(i) => (active = i)} />
	<Row t="ai" title="Call my daughter" meta="Task + calendar" trailing="Approved" />
	<Row t="ai" title="Talk to Carmen" meta="Time changed, then approved" trailing="Changed" />
	<Row t="ai" title="Tire receipt" meta="Cash entry" trailing="Undone" />
	<Row
		t="ai"
		href="/jot/unfiled"
		title="Unfiled jots"
		meta="2 notes still need one answer"
		trailing="›"
	/>
	<Btn primary={false} label="Undo the last approval" />
</Screen>
