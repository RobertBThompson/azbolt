<script>
	/**
	 * B5 Assets & Evidence — E3 Add asset.
	 * Two required fields. Value, category, rights and claim are all
	 * reachable from the draft and none of them block creation.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Btn, Note } from '$lib/kit';
</script>

<svelte:head><title>Add asset · Chief</title></svelte:head>

<Screen back="/records/assets" nav={false}>
	<Banner
		t="warm"
		title="Two things now, the rest later"
		meta="A record you can find beats a record that is complete."
	/>
	<Field label="What is it" placeholder="Required" />
	<Field label="Who owns it" placeholder="Person or organization" />
	<Btn t="warm" label="Create draft" />
	<Note>The draft appears in the list immediately, flagged as incomplete rather than hidden.</Note>
</Screen>
