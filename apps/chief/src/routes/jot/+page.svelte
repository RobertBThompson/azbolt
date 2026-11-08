<script>
	/**
	 * F2 Capture — Q1 Quick Jot.
	 * No category picker anywhere on this screen: classification is the
	 * machine's job, and the user's job is to say the thing before they
	 * forget it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Quick Jot · Chief</title></svelte:head>

<Screen>
	<Banner
		t="ai"
		title="What is on your mind?"
		meta="Type it or say it. One jot can hold several things."
	/>
	<Field
		label="Jot"
		placeholder="I need to call my daughter. Oh and I need to talk to Carmen ASAP."
	/>
	<Btn t="ai" label="Analyse this jot" />
	<Note>Capture never blocks on the network. Only analysis does.</Note>
</Screen>
