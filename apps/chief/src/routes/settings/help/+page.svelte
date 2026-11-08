<script>
	/**
	 * B8 — G3 Help.
	 * Indexed by intent, not by feature name — including one entry that
	 * exists purely to define a word the product could not avoid.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Help · Chief</title></svelte:head>

<Screen back="/settings" nav={false}>
	<Field label="What are you trying to do" placeholder="Search help" />
	<Row href="/settings/help/quick-jot" title="Use Quick Jot" meta="2 minutes" trailing="›" />
	<Row title="What “ownership” means here" meta="Plain language" trailing="›" />
	<Row title="Track an asset" meta="Step by step" trailing="›" />
	<Btn primary={false} href="/settings/help/contact" label="Contact support" />
</Screen>
