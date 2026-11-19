<script>
	/**
	 * B8 — G4 Account & legal.
	 * Destructive and legal actions separated from everyday settings, and
	 * the data export sits with them rather than three levels deep.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Account & legal · Chief</title></svelte:head>

<Screen back="/settings" nav={false}>
	<Row
		href="/settings/account/profile"
		title="Profile"
		meta="Name, password, sign out"
		trailing="›"
	/>
	<Row
		href="/settings/account/notifications"
		title="Notifications"
		meta="Channels and quiet hours"
		trailing="›"
	/>
	<Row
		href="/settings/account/privacy"
		title="Privacy policy"
		meta="Not written yet"
		trailing="›"
	/>
	<Row href="/settings/account/terms" title="Terms" meta="Not written yet" trailing="›" />
	<Btn primary={false} href="/settings/account/data" label="Export or delete my data" />
</Screen>
