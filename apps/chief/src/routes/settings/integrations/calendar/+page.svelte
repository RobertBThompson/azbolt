<script>
	/**
	 * B8 — G5 Google Calendar.
	 * Connected is not enough information. This states what Chief reads,
	 * what it may write, when it last worked, and what disconnecting leaves
	 * behind.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Google Calendar · Chief</title></svelte:head>

<Screen back="/settings/integrations" nav={false}>
	<Banner title="Connected · two-way" meta="Last synced 4 minutes ago." />
	<Row title="Reads" meta="Events and availability" trailing="On" />
	<Row title="Writes" meta="Only blocks you approve" trailing="On" />
	<Row title="Calendars" meta="Work and Personal" trailing="›" />
	<Row title="Sync history" meta="No unresolved errors" trailing="›" />
	<Btn label="Sync now" />
	<Btn primary={false} href="/settings/integrations" label="Disconnect" />
</Screen>
