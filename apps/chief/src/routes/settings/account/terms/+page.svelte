<script>
	/**
	 * B8 — G11 Terms.
	 * Same versioned reading pattern as Privacy. Section labels are plain
	 * enough to scan, while the final legal language stays a content
	 * dependency rather than wireframe filler.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Terms · Chief</title></svelte:head>

<Screen back="/settings/account" nav={false}>
	<Banner title="Terms · version 2.1" meta="Effective date and prior versions appear here." />
	<Row title="Using Chief" meta="Account and acceptable use" trailing="›" />
	<Row title="Your content" meta="Ownership and permissions" trailing="›" />
	<Row title="Availability and liability" meta="Service limits" trailing="›" />
	<Row title="Changes and ending service" meta="Notice and termination" trailing="›" />
	<Btn primary={false} label="Download a copy" soon />
</Screen>
