<script>
	/**
	 * B1 Onboarding — A3 What first?
	 * Two words, one optional third. No entity types, no ownership language,
	 * no explanation of the data model.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Seg, Btn, Note } from '$lib/kit';

	let pick = $state(0);
</script>

<svelte:head><title>What first? · Chief</title></svelte:head>

<Screen back="/onboarding/welcome" nav={false}>
	<Banner
		title="What should Chief help with first?"
		meta="This only shapes setup. It changes later."
	/>
	<Seg a="Personal" b="Business" bind:active={pick} />
	<Btn href="/onboarding/workspace" label="Both, actually" />
	<Note>The answer changes which four screens follow, not what the product can do.</Note>
</Screen>
