<script>
	/**
	 * B6 Money — M1.
	 * v2 gave Money four screens that were all forms and not one that told
	 * you anything. The sentence is the screen; the three numbers support it
	 * rather than replace it, so the claim is checkable rather than magical.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Stats, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Money · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<Banner
		t="warm"
		title="Azbolt has about 4.5 months of runway"
		meta="Based on the last 3 months of cash out. Updated today."
	/>
	<Stats
		items={[
			['$—', 'In / month'],
			['$—', 'Out / month'],
			['4.5', 'Months left']
		]}
	/>
	<Row
		t="warm"
		href="/records/money/liabilities"
		title="One payment due Friday"
		meta="Equipment lease · Build"
		trailing="›"
	/>
	<Row t="warm" title="Cash out is up 12%" meta="Mostly software subscriptions" trailing="›" />
	<Row
		t="warm"
		href="/records/money/cash-flow"
		title="Cash flow"
		meta="Entries, periods and duplicates"
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/money/liabilities"
		title="Liabilities"
		meta="2 active"
		trailing="›"
	/>
	<Btn t="warm" href="/records/money/amount" label="Record something" />
</Screen>
