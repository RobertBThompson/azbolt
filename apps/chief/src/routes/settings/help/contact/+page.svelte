<script>
	/**
	 * B8 — G7 Contact support.
	 * Diagnostics are opt-in and named before sending. A support request
	 * never quietly attaches jots, plan text or private notes just because
	 * they might help reproduce a problem.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Contact support · Chief</title></svelte:head>

<Screen back="/settings/help" nav={false}>
	<Banner
		title="What support will receive"
		meta="Your message and only the diagnostic details you choose below."
	/>
	<Field label="Subject" placeholder="What were you trying to do?" />
	<Field label="What happened" placeholder="Include the result you expected" />
	<Row title="App diagnostics" meta="Version, device and recent errors" trailing="Off" />
	<Row title="Private content" meta="Never attached automatically" trailing="Off" />
	<Btn label="Send to support" soon />
</Screen>
