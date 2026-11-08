<script>
	/**
	 * F2 Capture — Q10 Placement rules.
	 * Every rule here came from a correction the user approved. Nothing is
	 * learned silently, and the delete-all is one tap because trust requires
	 * an exit.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Placement rules · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Banner
		t="ai"
		title="What Chief learned from you"
		meta="Rules come only from corrections you approved."
	/>
	<Row
		t="ai"
		href="/jot/rules/carmen"
		title="Carmen"
		meta="Azbolt · work-hour blocks"
		trailing="On"
	/>
	<Row
		t="ai"
		href="/jot/rules/daughter"
		title="My daughter"
		meta="Personal · evenings"
		trailing="On"
	/>
	<Row t="ai" href="/jot/rules/receipts" title="Receipts" meta="Cash out · Azbolt" trailing="On" />
	<Btn primary={false} label="Delete all learned rules" />
</Screen>
