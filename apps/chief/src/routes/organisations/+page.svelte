<script>
	/**
	 * F1 Directory — D4 Organisations.
	 * Each described by what it does rather than by its entity type. The word
	 * "entity" does not appear.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Organisations · Chief</title></svelte:head>

<Screen back="/people" nav={false}>
	<Row
		t="cool"
		href="/organisations/tn"
		title="TN Holdings"
		meta="Holding · owns 4 entities"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/organisations/azbolt"
		title="Azbolt"
		meta="Software · 12 people"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/organisations/eagle"
		title="Eagle DAO"
		meta="Decentralised work network"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/organisations/save"
		title="SAVE"
		meta="Nonprofit · charity projects"
		trailing="›"
	/>
	<Btn t="cool" label="Add organisation" />
</Screen>
