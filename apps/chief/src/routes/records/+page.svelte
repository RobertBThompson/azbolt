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
	import Screen from '$lib/shell/Screen.svelte';
	import { Stats, Row, Btn, SourceNote } from '$lib/kit';
	import {
		activeAssets,
		assetValue,
		owedTotal,
		netWorth,
		short,
		signed,
		categorySummary,
		needingAttention,
		cashFor,
		cashTotals,
		upcomingPayment,
		dayLabel,
		inSentence,
		LINKS,
		ownershipTree,
		events
	} from '$lib/assets.js';

	const count = activeAssets().length;
	const categories = categorySummary().used.length;
	const attn = needingAttention().length;
	const net = cashTotals(cashFor('month')).net;
	const due = upcomingPayment();
	const loose = ownershipTree().loose.length;
	const last = events()[0];

	const assetsLine =
		`${count} assets in ${categories} categories` + (attn ? ` · ${attn} need attention` : '');
	const moneyLine =
		`Net ${signed(net)} this month` +
		(due ? ` · ${due.l.name.toLowerCase()} due ${inSentence(dayLabel(due.due))}` : '');
	const ownershipLine =
		`${LINKS.length} ownership links` +
		(loose ? ` · ${loose} ${loose === 1 ? 'asset has' : 'assets have'} no owner` : '');
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
			[short(netWorth()), 'Net worth']
		]}
	/>
	<Row t="warm" href="/records/assets" title="Assets" icon="asset" hue="wine" meta={assetsLine} trailing="›" />
	<Row t="warm" href="/records/money" title="Money" icon="cash" hue="green" meta={moneyLine} trailing="›" />
	<Row t="warm" href="/records/ownership" title="Ownership" icon="people" hue="blue" meta={ownershipLine} trailing="›" />
	<Row t="warm" href="/records/activity" title="Activity" icon="today" hue="night" meta={activityLine} trailing="›" />
	<Btn t="warm" href="/records/assets/new" label="Add asset" />
	<SourceNote source="fixture" />
</Screen>
