<script>
	/**
	 * B7 Business Plan — P7 Export.
	 * Warm tone: export sends real numbers outside the app, which makes it
	 * the only consequential screen in this branch. Private notes are
	 * excluded by default and the exclusion is visible, not buried in a
	 * settings sheet.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Chips, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Export · Chief</title></svelte:head>

<Screen back="/records/plans" nav={false}>
	<Chips t="warm" items={['PDF', 'Share link']} />
	<Row t="warm" title="Sections" meta="9 of 11 included" trailing="›" />
	<Row t="warm" title="Appendices" meta="Team, assets, cash summary" trailing="›" />
	<Row t="warm" title="Private notes" meta="Excluded" trailing="Off" />
	<Btn t="warm" label="Generate PDF" />
</Screen>
