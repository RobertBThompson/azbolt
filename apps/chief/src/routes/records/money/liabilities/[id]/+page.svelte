<script>
	/**
	 * Money — one liability.
	 * Who it is owed to and what it is secured on come first, as links to
	 * those records, because a debt is a relationship between an asset
	 * and an organization before it is a row of terms.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Stats, Row, Facts, SectionHead, Alert, Btn } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { page } from '$app/stores';
	import {
		ASSETS,
		LIABILITIES,
		dayLabel,
		liabilityGaps,
		money,
		nextDue,
		short
	} from '$lib/assets.js';

	const id = $derived(
		LIABILITIES[$page.params.id ?? ''] ? ($page.params.id ?? '') : 'business-loan'
	);
	const l = $derived(LIABILITIES[id]);
	const gaps = $derived(liabilityGaps(l));

	const terms = $derived([
		{ label: 'Loan type', value: l.type },
		{ label: 'Started', value: l.started },
		{ label: 'Start amount', value: money(l.startAmount) },
		{ label: 'Interest rate', value: l.rate ? `${l.rate}%` : 'None' },
		{ label: 'Payment', value: `${money(l.payment)} ${l.frequency.toLowerCase()}` },
		{ label: 'Term', value: `${l.months} months` }
	]);
</script>

<svelte:head><title>{l.name} · Chief</title></svelte:head>

<Screen back="/records/money/liabilities" nav={false}>
	<PageHead
		eyebrow={l.type}
		title={l.name}
		meta="{ORGS[l.borrower]?.name ?? l.borrower} owes this"
	/>
	{#if gaps.length}
		<Alert title="Not fully tied in" meta={gaps.join(' · ')} />
	{/if}
	<Stats
		items={[
			[short(l.balance), 'Balance'],
			[money(l.payment), l.frequency],
			[dayLabel(nextDue(l)), 'Next due']
		]}
	/>

	{#if l.lender}
		<Row
			t="warm"
			href="/organizations/{l.lender}"
			title="Lender"
			meta={ORGS[l.lender]?.name ?? l.lender}
			trailing="↗"
		/>
	{:else}
		<Row
			t="alert"
			href="/records/money/liabilities/{id}/edit"
			title="Lender"
			meta="Not linked to an organization"
			trailing="⚠"
		/>
	{/if}
	{#if l.asset}
		<Row
			t="warm"
			href="/records/assets/{l.asset}"
			title="Secured against"
			meta={ASSETS[l.asset]?.name ?? l.asset}
			trailing="↗"
		/>
	{:else}
		<Row
			t="alert"
			href="/records/money/liabilities/{id}/edit"
			title="Secured against"
			meta="Not tied to an asset"
			trailing="⚠"
		/>
	{/if}

	<SectionHead label="Terms" t="warm" />
	<Facts items={terms} />

	<Btn t="warm" href="/records/money/liabilities/{id}/edit" label="Edit liability" />
</Screen>
