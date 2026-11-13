<script>
	/**
	 * Money — liabilities.
	 *
	 * What is owed, what it costs a month, and what is due next. Each
	 * liability is debt against a particular asset, owed to a particular
	 * organization, and its row names both — a loan that is not tied to
	 * either is flagged, because that is the half of the record that makes
	 * it mean something.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Stats, Row, Btn, SectionHead, SourceNote, Blank } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { MONEY_LENSES } from '$lib/asset/money-lenses.js';
	import {
		ASSETS,
		dayLabel,
		inSentence,
		liabilities,
		liabilityGaps,
		money,
		owedMonthly,
		owedTotal,
		short,
		upcomingPayment
	} from '$lib/assets.js';

	const list = liabilities();
	const due = upcomingPayment();

	/** @param {(typeof list)[number]} l */
	const line = (l) =>
		[
			`${money(l.balance)} left`,
			l.asset ? `on ${ASSETS[l.asset]?.name}` : 'not tied to an asset',
			l.lender ? ORGS[l.lender]?.name : 'lender not linked'
		].join(' · ');
</script>

<svelte:head><title>Liabilities · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<LensSwitch label="Money view" items={MONEY_LENSES} at="/records/money/liabilities" />
	<Stats
		items={[
			[short(owedTotal()), 'Balance'],
			[money(owedMonthly()), 'Monthly'],
			[String(list.length), 'Active']
		]}
	/>

	{#if due}
		<Row
			t="alert"
			href="/records/money/liabilities/{due.l.id}"
			title="Upcoming payment"
			meta="{due.l.name} · {money(due.l.payment)} due {inSentence(dayLabel(due.due))}"
			trailing="›"
		/>
	{/if}

	<SectionHead label="Owed" t="warm" count={list.length} />
	{#each list as l (l.id)}
		<Row
			t="warm"
			href="/records/money/liabilities/{l.id}"
			title={l.name}
			meta={line(l)}
			trailing={liabilityGaps(l).length ? '⚠' : '›'}
		/>
	{:else}
		<Blank>Nothing is owed.</Blank>
	{/each}

	<Btn t="warm" href="/records/money/liabilities/new" label="Add liability" />
	<SourceNote source="fixture" />
</Screen>
