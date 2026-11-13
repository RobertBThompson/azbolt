<script>
	/**
	 * B8 System & Trust.
	 * Settings left the bottom nav: it sits in the app-bar context menu, one
	 * tap from every screen instead of two taps from one.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Row } from '$lib/kit';
</script>

<svelte:head><title>Settings · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Row
		href="/settings/integrations"
		title="Integrations"
		meta="Calendar, contacts, file storage"
		trailing="›"
	/>
	<Row
		href="/settings/help"
		title="Help"
		meta="Indexed by what you are trying to do"
		trailing="›"
	/>
	<Row
		href="/settings/account"
		title="Account & legal"
		meta="Profile, privacy, export"
		trailing="›"
	/>
</Screen>
