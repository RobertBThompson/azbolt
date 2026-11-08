<script>
	/**
	 * B1 Onboarding — A1 Splash.
	 * Low-stakes screen: one idea, large type, nothing to decide. The density
	 * difference between this and M6 is the visual hierarchy doing its job.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Prog } from '$lib/kit';
	import { shell } from '$lib/state.svelte.js';

	// Not signed in yet — the context band has nothing to report.
	shell.context = 'account';
</script>

<svelte:head><title>Chief</title></svelte:head>

<Screen nav={false}>
	<Hero title="Chief" meta="Build what matters." />
	<Prog title="Preparing your workspace" value={0.72} meta="Loading securely" />
</Screen>
