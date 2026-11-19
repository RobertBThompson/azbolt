<script>
	/**
	 * Money — liabilities.
	 *
	 * What is owed, what it costs a month, and what is due next. Each
	 * liability is debt against a particular asset, owed to a particular
	 * organization, and its row names both — a loan that is not tied to
	 * either is flagged, because that is the half of the record that makes
	 * it mean something.
	 *
	 * This is a door from Money, not one side of a switch over it, so the
	 * back arrow goes to Money. The next payment due is said on the row of
	 * the liability it is for; a red row of its own above the list read as
	 * an emergency, and it was the same row said twice.
	 */
	import { book } from '$lib/book.svelte.js';
	import Screen from '$lib/shell/Screen.svelte';
	import { Stats, Row, Btn, SectionHead, SourceNote, Blank } from '$lib/kit';
	import { ORGS } from '$lib/assets.js';
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
			l.lender ? ORGS[l.lender]?.name : 'lender not linked',
			due && due.l.id === l.id
				? `next ${money(l.payment)} due ${inSentence(dayLabel(due.due))}`
				: ''
		]
			.filter(Boolean)
			.join(' · ');
</script>

<svelte:head><title>Liabilities · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	<Stats
		items={[
			[short(owedTotal()), 'Balance'],
			[money(owedMonthly()), 'Monthly'],
			[String(list.length), 'Active']
		]}
	/>

	<Btn t="warm" href="/records/money/liabilities/new" label="Add liability" />

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

	<SourceNote source={book.source} error={book.error} />
</Screen>
