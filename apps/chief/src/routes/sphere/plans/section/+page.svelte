<script>
	/**
	 * B7 Business Plan — P4 Section review.
	 * Your words on top with a timestamp, the draft below. Both editable.
	 * The provenance line is what makes the draft arguable instead of just
	 * accepted.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Note, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Section review · Chief</title></svelte:head>

<Screen back="/sphere/plans/coverage" nav={false}>
	<Banner t="ai" title="Market — drafted" meta="Your words on top, my draft below. Edit either." />
	<Note>“small logistics firms, mostly 5 to 40 trucks” — you, at 0:23</Note>
	<!-- A drafted paragraph in a one-line input is a paragraph you cannot read. -->
	<Field
		label="Draft"
		lines={5}
		value="Azbolt serves small logistics operators running fleets of five to forty vehicles, where scheduling is still done by phone..."
	/>
	<Btn t="ai" href="/sphere/plans/gaps" label="Accept this section" />
	<Btn primary={false} label="Rewrite it myself" soon />
</Screen>
