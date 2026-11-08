<script>
	/**
	 * B4 Structure & Ownership — R5 Ownership tree.
	 * The optional visual. An SVG node graph is invisible to a screen reader
	 * and unusable with switch control, so the List tab is canonical, not a
	 * fallback: everything the graph shows is on the list, including share
	 * and status. That is the condition for keeping it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Ownership tree · Chief</title></svelte:head>

<Screen back="/records/ownership" nav={false}>
	<Banner t="warm" title="Owner → owned" meta="Tap any entity to open its record." />
	<Row t="warm" title="TN Holdings" meta="Root · 4 entities" dot={false} />
	<Row
		t="warm"
		href="/records/ownership/azbolt"
		title="→ Azbolt"
		meta="100% · controlling"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/ownership/build"
		title="→ Build"
		meta="Division · operating control"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/ownership/ame"
		title="→ AME"
		meta="Governed separately"
		trailing="›"
	/>
	<Btn primary={false} href="/records/ownership" label="Switch to list" />
</Screen>
