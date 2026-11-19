<script>
	/**
	 * B4 — R6 Reporting relationship.
	 * Cool: reporting detail stays a reversible sentence assembled from two
	 * Directory records. Editing the role or manager changes the graph and
	 * the list together, because they are two views of this one record.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Btn, Field, Row, SourceNote } from '$lib/kit';
</script>

<svelte:head><title>Reporting relationship · Chief</title></svelte:head>

<Screen back="/organizations/structure" nav={false}>
	<Banner t="cool" title="Carmen reports to Dev" meta="As Operations lead · active" />
	<Row t="cool" href="/people/carmen" title="Who" meta="Carmen Ruiz" trailing="↗" />
	<Row t="cool" href="/people/dev" title="Reports to" meta="Dev Patel" trailing="↗" />
	<Field label="As" value="Operations lead" />
	<Row t="cool" title="Effective" meta="Current · since 2 May" trailing="›" />
	<Btn t="cool" label="Save changes" soon />
	<SourceNote source="fixture" />
</Screen>
