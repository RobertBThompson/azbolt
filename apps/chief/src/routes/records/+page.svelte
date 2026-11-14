<script>
	/**
	 * The Asset tab.
	 *
	 * Three numbers, then four doors. Net worth is on the strip because it
	 * is a number Chief always knows — assets minus liabilities, worked
	 * out from the records, never something to go and ask for.
	 *
	 * The doors are the four things a Chief does with what they hold:
	 * look at it, follow the money it earns and costs, see who holds it,
	 * and see what has happened to it. Each says what is behind it before
	 * it is opened, so the page is worth a glance even with nowhere to go.
	 *
	 * There is no All · Personal · Work filter. That split is what
	 * spheres replaced, and the sphere is already named at the top of the
	 * screen.
	 */
	import { book } from '$lib/book.svelte.js';
	import Screen from '$lib/shell/Screen.svelte';
	import { Blank, Btn, Row, SourceNote, Stats } from '$lib/kit';
	import {
		ownershipLinks,
		activeAssets,
		assetValue,
		cashFor,
		cashTotals,
		categorySummary,
		dayLabel,
		events,
		inSentence,
		needingAttention,
		ORGS,
		netWorth,
		netWorthOf,
		ownBook,
		owedTotal,
		ownershipTree,
		short,
		signed,
		upcomingPayment,
		valueSummary
	} from '$lib/assets.js';

	/* Decision 2 and 3: a figure belongs to an organization, and yours
	   is your own organization's. The samples have no "you", so they
	   show the total across the tops of every chain instead. */
	const mine = Object.entries(ORGS).find(([, o]) => o.self)?.[0] ?? null;

	const count = activeAssets().length;
	const categories = categorySummary().used.length;
	const attn = needingAttention().length;
	const net = cashTotals(cashFor('month')).net;
	const due = upcomingPayment();
	const loose = ownershipTree().loose.length;
	const last = events()[0];

	const assetsLine =
		`${count} ${count === 1 ? 'asset' : 'assets'} in ${categories} ${categories === 1 ? 'category' : 'categories'}` +
		(attn ? ` · ${attn} ${attn === 1 ? 'needs' : 'need'} attention` : '');
	const moneyLine =
		`Net ${signed(net)} this month` +
		(due ? ` · ${due.l.name.toLowerCase()} due ${inSentence(dayLabel(due.due))}` : '');
	const ownershipLine =
		`${ownershipLinks().length} ownership links` +
		(loose ? ` · ${loose} ${loose === 1 ? 'asset has' : 'assets have'} no owner` : '');
	const { unvalued } = valueSummary(activeAssets());

	const activityLine = last
		? `${last.type} · ${last.name} · ${inSentence(last.when)}`
		: 'Nothing yet';
</script>

<svelte:head><title>Asset · Chief</title></svelte:head>

<Screen>
	<Stats
		items={[
			[short(assetValue()), 'Asset value'],
			[short(owedTotal()), 'Liabilities'],
			[short(mine ? netWorthOf(mine) : netWorth()), mine ? 'Your net worth' : 'Net worth']
		]}
	/>
	<!--
		Two things the figures do not say on their own: what is missing
		from them, and whose they are.
	-->
	<Blank>
		{#if unvalued || loose}
			{[
				unvalued ? `${unvalued} ${unvalued === 1 ? 'asset has' : 'assets have'} no value yet` : '',
				loose
					? `${loose}${unvalued ? '' : loose === 1 ? ' asset' : ' assets'} ${loose === 1 ? 'is' : 'are'} held by no organization`
					: ''
			]
				.filter(Boolean)
				.join(', and ')}, so {unvalued + loose === 1 ? 'it is' : 'they are'} left out of net worth.
		{/if}
		{#if ownBook()}
			Your net worth is what your own organization holds: its share of each thing, and its share of
			what the organizations it owns are worth.
		{:else}
			These are sample figures, across every sample organization.
		{/if}
	</Blank>
	<Row
		t="warm"
		href="/records/assets"
		title="Assets"
		icon="asset"
		hue="wine"
		meta={assetsLine}
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/money"
		title="Money"
		icon="cash"
		hue="green"
		meta={moneyLine}
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/ownership"
		title="Ownership"
		icon="people"
		hue="blue"
		meta={ownershipLine}
		trailing="›"
	/>
	<Row
		t="warm"
		href="/records/activity"
		title="Activity"
		icon="today"
		hue="night"
		meta={activityLine}
		trailing="›"
	/>
	<Btn t="warm" href="/records/assets/new" label="Add asset" />
	<SourceNote source={book.source} error={book.error} />
</Screen>
