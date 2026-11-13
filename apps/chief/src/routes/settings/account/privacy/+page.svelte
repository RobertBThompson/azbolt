<script>
	/**
	 * B8 — G10 Privacy policy.
	 * Leads with version and effective date, then a scannable outline. The
	 * map does not invent legal copy: implementation renders the approved
	 * text under these stable section anchors.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Privacy policy · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	<Banner
		title="Privacy policy · version 2.1"
		meta="Effective date and prior versions appear here."
	/>
	<Row title="What Chief collects" meta="Account, records and device data" trailing="›" />
	<Row title="How AI uses data" meta="Processing and retained controls" trailing="›" />
	<Row title="Sharing and providers" meta="Who receives which data" trailing="›" />
	<Row title="Your choices" meta="Access, export and deletion" trailing="›" />
	<Btn primary={false} label="Download a copy" soon />
</Screen>
