<script>
	/**
	 * B4 — R6 Reporting relationship.
	 * Cool: reporting detail stays a reversible sentence assembled from two
	 * Directory records. Editing the role or manager changes the graph and
	 * the list together, because they are two views of this one record.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Field, Btn } from '$lib/kit';
</script>

<svelte:head><title>Reporting relationship · Chief</title></svelte:head>

<Screen back="/records/structure" nav={false}>
	<Banner t="cool" title="Carmen reports to Pamela" meta="As Operations lead · active" />
	<Row t="cool" href="/people/carmen" title="Who" meta="Carmen Mendez" trailing="↗" />
	<Row t="cool" href="/people/pamela" title="Reports to" meta="Pamela Anderson" trailing="↗" />
	<Field label="As" value="Operations lead" />
	<Row t="cool" title="Effective" meta="Current · since 2 May" trailing="›" />
	<Btn t="cool" label="Save changes" />
</Screen>
