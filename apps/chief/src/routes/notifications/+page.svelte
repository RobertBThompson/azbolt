<script>
	/**
	 * F0 Shell — SH3 Notifications.
	 * Split by whether you have to do something. v2 split by time, which does
	 * not tell you that. The rust item is the only alarming thing on the
	 * screen, which is the point of reserving the colour.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Appr, Row, Alert } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Notifications · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Tabs items={['Needs action', 'Updates']} {active} onpick={(i) => (active = i)} />
	<Appr
		title="Placement waiting"
		meta="Quick Jot · 2 minutes ago"
		confidence="Review"
		index={1}
		total={1}
	/>
	<Row t="cool" title="Endeavor due Friday" meta="Website launch" trailing="↗" />
	<Alert
		title="Calendar sync failed"
		meta="Google Calendar · last synced 4 hours ago. Tap to retry."
	/>
	<Row t="cool" title="Ownership link changed" meta="TN Holdings · by Pamela" trailing="↗" />
</Screen>
