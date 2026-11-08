<script>
	/**
	 * B2 Today — T3 Records.
	 * The replacement for "More". Four areas, each with what changed since
	 * you last looked, so the page is worth opening even when you are not
	 * going anywhere specific. Assets sits first because it lost its
	 * bottom-nav slot — the one tap it costs is paid back here.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row } from '$lib/kit';
</script>

<svelte:head><title>Records · Chief</title></svelte:head>

<Screen>
	<Banner t="cool" title="Everything not used daily" meta="Four areas, and what changed in each." />
	<Row
		t="warm"
		href="/records/assets"
		title="Assets & evidence"
		meta="41 assets · 2 need attention"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/money"
		title="Money"
		meta="Runway 4.5 months · 1 payment Friday"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/structure"
		title="Structure & ownership"
		meta="No changes since June"
		trailing="›"
	/>
	<Row
		t="cool"
		href="/records/plans/overview"
		title="Business plans"
		meta="Azbolt · 2 gaps left"
		trailing="›"
	/>
</Screen>
