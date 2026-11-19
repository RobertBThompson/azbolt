<script>
	/**
	 * B4 Structure & Ownership — R1 Team structure.
	 * Cool tone: arranging a diagram, reversible, low stakes.
	 * List is the default on mobile and the tree is the second tab, not the
	 * other way round. Each row reads as a sentence.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Btn, Row, SourceNote, Tabs } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Team structure · Chief</title></svelte:head>

<Screen back="/organizations" nav={false}>
	<Tabs items={['List', 'Tree']} {active} onpick={(i) => (active = i)} />
	<Row
		t="cool"
		href="/organizations/structure/pamela"
		title="Dev Patel"
		meta="CEO · reports to the board"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/organizations/structure/carmen"
		title="Carmen Ruiz"
		meta="Operations · reports to Dev"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/organizations/structure/sam"
		title="Sam Smith"
		meta="Sales · reports to Carmen"
		trailing="›"
	/>
	<Btn t="cool" href="/organizations/structure/add" label="Add a reporting link" />
	<SourceNote source="fixture" />
</Screen>
