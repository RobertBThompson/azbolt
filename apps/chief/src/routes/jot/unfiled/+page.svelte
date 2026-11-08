<script>
	/**
	 * F2 Capture — Q12 Unfiled jots.
	 * Zero-confidence notes get a durable recovery queue rather than
	 * disappearing into history. Each row states the single missing fact,
	 * while leaving it unfiled remains a valid choice.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Tabs, Row, Btn } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Unfiled jots · Chief</title></svelte:head>

<Screen back="/jot/history" nav={false}>
	<Alert title="2 notes still need context" meta="Your original words are preserved exactly." />
	<Tabs items={['Needs answer', 'Filed']} {active} onpick={(i) => (active = i)} />
	<Row
		t="ai"
		href="/jot/unplaced"
		title="Ask about the thing before it closes"
		meta="Needs a person or subject"
		trailing="›"
	/>
	<Row
		t="ai"
		href="/jot/unplaced"
		title="Check storage before Friday"
		meta="Needs an asset or sphere"
		trailing="›"
	/>
	<Btn t="ai" href="/jot/unplaced" label="Review the next one" />
</Screen>
