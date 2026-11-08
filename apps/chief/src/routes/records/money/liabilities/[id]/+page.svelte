<script>
	/**
	 * B6 — M7 Liability.
	 * Leads with impact and next timing, then exposes terms, security and
	 * proof. This is the stable record users return to after the two-step
	 * creation flow.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Stats, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
</script>

<svelte:head><title>Liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities" nav={false}>
	<Banner t="warm" title="Business loan" meta="Azbolt · active · due Friday" />
	<Stats
		items={[
			['$—', 'Balance'],
			['$—', 'Monthly'],
			['Fri', 'Next due']
		]}
	/>
	<Row t="warm" href="/organizations" title="Lender" meta="Linked organization" trailing="↗" />
	<Row t="warm" title="Terms" meta="Rate, frequency and end date" trailing="›" />
	<Row
		t="warm"
		href="/records/assets"
		title="Secured against"
		meta="Linked asset record"
		trailing="↗"
	/>
	<Row t="warm" title="Documents" meta="2 records" trailing="›" />
	<Btn t="warm" href="/records/money/liabilities/{$page.params.id}/edit" label="Edit liability" />
</Screen>
