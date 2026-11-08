<script>
	/**
	 * B8 — G2 AI & privacy.
	 * The first line is not a setting. Stating what cannot be turned off is
	 * what makes the toggles below it credible.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>AI & privacy · Chief</title></svelte:head>

<Screen back="/settings" nav={false}>
	<Banner
		t="ai"
		title="AI never writes without you"
		meta="This one cannot be switched off. It is the product."
	/>
	<Row t="ai" title="Remember my corrections" meta="Only from changes you approved" trailing="On" />
	<Row t="ai" title="Keep voice recordings" meta="The transcript is enough" trailing="Off" />
	<Row
		t="ai"
		href="/jot/history"
		title="Placement activity"
		meta="Every AI action, reversible"
		trailing="›"
	/>
	<Btn primary={false} href="/jot/rules" label="Delete all learned rules" />
</Screen>
