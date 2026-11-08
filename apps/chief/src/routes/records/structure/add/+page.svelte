<script>
	/**
	 * B4 Structure & Ownership — R2 Add a link.
	 * Three fields that assemble into the sentence shown above them. The user
	 * never sees the words "node", "edge" or "relationship type".
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Add a link · Chief</title></svelte:head>

<Screen back="/records/structure" nav={false}>
	<Banner t="cool" title="Build one sentence" meta="Carmen reports to Pamela as Operations lead." />
	<Field label="Who" placeholder="Carmen Mendez" />
	<Field label="Reports to" placeholder="Pamela Anderson" />
	<Field label="As" placeholder="Operations lead" />
	<Btn t="cool" label="Save this connection" />
</Screen>
