<script>
	/**
	 * B2 Today — T4 Opportunity.
	 * The suggestion can be checked without trusting a summary. Evidence is
	 * read-only, and the only write is an explicit action the user chooses
	 * after seeing why Chief noticed it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Btn, Row, SourceNote } from '$lib/kit';
</script>

<svelte:head><title>Opportunity · Chief</title></svelte:head>

<Screen back="/opportunities" nav={false}>
	<Banner
		t="cool"
		title="Idle equipment could unblock Build"
		meta="18 items have no recorded use since March; the Build pilot needs four."
	/>
	<Row
		t="cool"
		href="/records/assets"
		title="Evidence"
		meta="Asset activity · 18 matching records"
		trailing="↗"
	/>
	<Row
		t="cool"
		href="/work/endeavors/build"
		title="Related work"
		meta="Build pilot · 2 tasks waiting"
		trailing="↗"
	/>
	<Row t="cool" title="Confidence" meta="High · records agree" trailing="Why" />
	<Btn t="cool" label="Turn into an endeavor action" soon />
	<Btn primary={false} href="/opportunities" label="Dismiss with a reason" />
	<SourceNote source="fixture" />
</Screen>
