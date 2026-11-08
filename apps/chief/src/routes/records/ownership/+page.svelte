<script>
	/**
	 * B4 Structure & Ownership — R3 Ownership.
	 * Warm tone: these screens create records with financial and legal
	 * weight. "Owns" and "Owned by" are the plain-language version of a
	 * directed edge.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Tabs, Row, Btn } from '$lib/kit';

	let active = $state(0);
</script>

<svelte:head><title>Ownership · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<Tabs items={['Owns', 'Owned by']} {active} onpick={(i) => (active = i)} />
	<Row
		t="warm"
		href="/records/ownership/azbolt"
		title="Azbolt"
		meta="Company · controlling interest"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/ownership/build"
		title="Build"
		meta="Division · operating control"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/ownership/ame"
		title="AME"
		meta="Exchange arm · governed separately"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/ownership/tree"
		title="Ownership tree"
		meta="Optional visual view"
		trailing="›"
	/>
	<Btn t="warm" label="Add an ownership link" />
</Screen>
