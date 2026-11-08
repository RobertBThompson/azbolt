<script>
	/**
	 * F2 Capture — Q2 Listening.
	 * Transcript is visible while you speak and every word is correctable
	 * before analysis, so a mis-hear costs a tap rather than the whole jot.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Wave, Banner, Btn } from '$lib/kit';
</script>

<svelte:head><title>Listening · Chief</title></svelte:head>

<Screen back="/jot" nav={false}>
	<Wave text="I need to call my daughter. Oh and I need to talk to Carmen ASAP." />
	<Banner t="ai" title="Live transcript" meta="Tap any word to fix it before analysis." />
	<Btn t="ai" href="/jot/split" label="Done speaking" />
	<Btn primary={false} href="/jot" label="Cancel" />
</Screen>
