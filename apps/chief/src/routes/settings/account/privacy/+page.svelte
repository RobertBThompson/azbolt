<script>
	/**
	 * B8 — Privacy policy.
	 * There is no approved text yet, and this screen says so instead of
	 * showing a version number over an outline with nothing under it.
	 * What it can say truthfully is how the app behaves today.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Note } from '$lib/kit';
</script>

<svelte:head><title>Privacy policy · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	<Banner title="Privacy policy" meta="Not written yet. Chief is in testing." />
	<Row title="Where your records are kept" meta="On the Chief server, under your own account" />
	<Row
		title="Who can see them"
		meta="Only the account that made them, and whoever keeps the server"
	/>
	<Row
		href="/settings/account/data/export"
		title="Taking a copy"
		meta="One file with everything, whenever you like"
		trailing="›"
	/>
	<Row
		href="/settings/account/data/delete"
		title="Leaving"
		meta="Deletes the account and every record under it"
		trailing="›"
	/>
	<Note>
		These four lines describe how Chief works today. They are not the privacy policy; that will
		appear here, with its date, once it is written.
	</Note>
</Screen>
