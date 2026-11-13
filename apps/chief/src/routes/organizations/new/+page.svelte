<script>
	/**
	 * F1 Directory — D8 Add organization.
	 * This creates the one Directory record every other branch links to.
	 * Entity type stays optional and explanatory; ownership, people and
	 * proof are added only after the sphere exists.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Field, Chips, Btn } from '$lib/kit';
</script>

<svelte:head><title>Add organization · Chief</title></svelte:head>

<Screen back="/organizations" nav={false}>
	<Banner
		t="cool"
		title="Start with what it is for"
		meta="Structure and records can be attached after it exists."
	/>
	<Field label="Name" placeholder="Organization name" />
	<Chips t="cool" items={['Company', 'Holding', 'Nonprofit', 'DAO']} active={-1} />
	<Field label="What does it do" placeholder="One sentence is enough" />
	<Btn t="cool" label="Create organization" soon />
</Screen>
