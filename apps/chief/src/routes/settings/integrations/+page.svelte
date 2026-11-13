<script>
	/**
	 * B8 — G1 Integrations.
	 * Sync status is stated in plain time, and contacts shows the count
	 * actually imported rather than "granted".
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Integrations · Chief</title></svelte:head>

<Screen back="/settings" nav={false}>
	<Row
		href="/settings/integrations/calendar"
		title="Google Calendar"
		meta="Not connected"
		trailing="On"
	/>
	<Row title="Outlook Calendar" meta="Not connected" trailing="›" />
	<Row title="Device contacts" meta="12 of 340 imported" trailing="On" />
	<Row title="File storage" meta="Choose a provider" trailing="›" />
	<Btn primary={false} label="Manage connections" soon />
</Screen>
