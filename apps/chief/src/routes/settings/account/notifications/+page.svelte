<script>
	/**
	 * B8 — G9 Notifications.
	 * Follows the same "needs action versus updates" split as the inbox.
	 * Quiet hours apply across channels, while sync failures stay visible
	 * in-app even when push is off.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Row, Btn } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Notifications · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	<Tabs items={['Push', 'Email']} {active} onpick={(i) => (active = i)} />
	<Row title="Placements waiting" meta="Needs action" trailing="On" />
	<Row title="Tasks and due dates" meta="Reminders" trailing="On" />
	<Row title="Sync failures" meta="System warning" trailing="On" />
	<Row title="Quiet hours" meta="10:00 PM–7:00 AM" trailing="›" />
	<Btn label="Save notification settings" />
</Screen>
