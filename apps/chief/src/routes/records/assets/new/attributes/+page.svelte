<script>
	/**
	 * Assets — add, step two.
	 * The draft already exists. These are the technical attributes, and
	 * every one can be left for later.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Btn } from '$lib/kit';
	import AttributeFields from '$lib/asset/AttributeFields.svelte';
</script>

<svelte:head><title>Attributes · Add asset · Chief</title></svelte:head>

<Screen back="/records/assets/new" nav={false}>
	<Prog t="warm" title="Attributes" value={1} meta="Step 2 of 2 · nothing is saved yet" />
	<AttributeFields />
	<Btn t="warm" label="Save attributes" soon />
	<Btn primary={false} href="/records/assets" label="Back to assets" />
</Screen>
