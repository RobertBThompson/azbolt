<script>
	/**
	 * B6 Money — MS1/MS2/MS3 Cash flow, in its three real states.
	 * These are states of one screen, not three destinations, so they are
	 * selected by ?state= rather than given routes of their own. Empty is
	 * honest about runway being meaningless without history; the duplicate
	 * state offers the likely-correct action without taking it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Hero, Banner, Tabs, Stats, Row, Chips, Alert, Btn } from '$lib/kit';
	import { page } from '$app/stores';

	const view = $derived($page.url.searchParams.get('state') ?? 'populated');
	let active = $state(0);
</script>

<svelte:head><title>Cash flow · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	{#if view === 'empty'}
		<Hero
			t="warm"
			title="No cash recorded yet"
			meta="Record one thing — a sale, a subscription, a receipt."
		/>
		<Banner
			t="warm"
			title="Runway needs about a month of history"
			meta="Until then Chief will show what you entered, not a forecast."
		/>
		<Btn t="warm" href="/records/money/amount" label="Record the first one" />
	{:else if view === 'duplicate'}
		<Alert
			title="Possible duplicate"
			meta="Two $1,240 entries to Azbolt · Software, 40 seconds apart."
		/>
		<Row t="warm" title="6:12 PM · $1,240" meta="Software · Azbolt" trailing="Keep" />
		<Row t="warm" title="6:13 PM · $1,240" meta="Software · Azbolt" trailing="Merge" />
		<Btn t="warm" label="Merge into one" />
		<Btn primary={false} label="Keep both — they are different" />
	{:else}
		<Tabs items={['Overview', 'Entries']} {active} onpick={(i) => (active = i)} />
		<Stats
			items={[
				['$—', 'In'],
				['$—', 'Out'],
				['$—', 'Net']
			]}
		/>
		<Row t="warm" title="Book sales" meta="Cash in · monthly" trailing="+$—" />
		<Row t="warm" title="Software services" meta="Cash out · monthly" trailing="−$—" />
		<Chips t="warm" items={['This month', 'Quarter', 'Year']} />
	{/if}
</Screen>
