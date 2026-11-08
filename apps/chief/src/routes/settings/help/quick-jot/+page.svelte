<script>
	/**
	 * B8 — G6 Use Quick Jot.
	 * Help answers the intent in three steps and links to the real surface.
	 * It does not duplicate the feature or make the user translate their
	 * question into product vocabulary.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Use Quick Jot · Chief</title></svelte:head>

<Screen back="/settings/help" nav={false}>
	<Banner
		title="Use Quick Jot"
		meta="Capture several thoughts in one sentence, then approve where each one goes."
	/>
	<Row
		title="1 · Say the whole thought"
		meta="Voice or text; categories are unnecessary"
		dot={false}
	/>
	<Row title="2 · Check the split" meta="Correct words before placements" dot={false} />
	<Row title="3 · Approve the writes" meta="Nothing exists before this tap" dot={false} />
	<Btn t="ai" href="/jot" label="Open Quick Jot" />
	<Btn primary={false} href="/settings/help/contact" label="Still need help?" />
</Screen>
