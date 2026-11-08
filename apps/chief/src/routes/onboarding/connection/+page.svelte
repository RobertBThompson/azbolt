<script>
	/**
	 * B1 Onboarding — A5 One connection.
	 * Ends on a sentence, not a form: "Carmen works with Azbolt." The app is
	 * never empty on first open, which is the only real job of this step.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Banner, Field, Btn } from '$lib/kit';
	import { shell } from '$lib/state.svelte.js';

	shell.context = 'azbolt';
</script>

<svelte:head><title>One connection · Chief</title></svelte:head>

<Screen back="/onboarding/sphere" nav={false}>
	<Prog t="cool" title="Setup" value={1} meta="Step 2 of 2" />
	<Banner
		t="cool"
		title="One connection, so the app is not empty"
		meta="For example: Carmen works with Azbolt."
	/>
	<Field label="Person" placeholder="Carmen" />
	<Field label="Connection" placeholder="Works with" />
	<Btn t="cool" href="/" label="Finish setup" />
	<Btn primary={false} href="/" label="Skip for now" />
</Screen>
