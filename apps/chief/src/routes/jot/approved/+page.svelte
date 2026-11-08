<script>
	/**
	 * F2 Capture — Q5 Approved.
	 * Undo is stated with a duration. "Reversible" is only true if the user
	 * knows for how long.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Approved · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Banner
		t="ai"
		title="4 records placed"
		meta="Undo is available for 24 hours, then from history."
	/>
	<Row t="ai" title="Call my daughter" meta="Task + calendar · Personal" trailing="7:00 PM" />
	<Row t="ai" title="Talk to Carmen" meta="Task + calendar · Azbolt" trailing="3:30 PM" />
	<Btn t="cool" href="/" label="Back to Today" />
	<Btn primary={false} href="/jot/history" label="Undo all 4" />
</Screen>
