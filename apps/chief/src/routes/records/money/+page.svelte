<script>
	/**
	 * Money — cash flow.
	 *
	 * Cash in, cash out and the difference, for a period. The difference
	 * is not profit; it is cash in minus cash out, which is a number worth
	 * knowing on its own terms.
	 *
	 * Only entries that have actually moved are counted. The cash types
	 * exist to keep what has happened apart from what is expected —
	 * receivable, projected, accrued, payable — so those are listed with
	 * their type and left out of the three figures.
	 *
	 * Overview is one row per line. Transactions is every entry, and the
	 * same entries regroup by month or by cash type, each group with its
	 * own subtotal.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import {
		Filter,
		Stats,
		Tabs,
		Banner,
		Row,
		SectionHead,
		Btn,
		Note,
		Hero,
		Alert,
		Blank,
		SourceNote
	} from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { page } from '$app/stores';
	import { MONEY_LENSES } from '$lib/asset/money-lenses.js';
	import {
		cashFor,
		cashLines,
		cashTotals,
		counted,
		dayLabel,
		groupCash,
		money,
		runway,
		short,
		signed,
		txAmount
	} from '$lib/assets.js';

	const view = $derived($page.url.searchParams.get('state') ?? 'default');

	const PERIODS = [
		{ key: 'month', label: 'This month' },
		{ key: 'quarter', label: 'Quarter' },
		{ key: 'year', label: 'Year' }
	];
	const SORTS = [
		{ key: 'period', label: 'By period' },
		{ key: 'type', label: 'By cash type' }
	];

	let period = $state('month');
	let tab = $state(0);
	let sort = $state('period');

	const list = $derived(cashFor(/** @type {'month'|'quarter'|'year'} */ (period)));
	const totals = $derived(cashTotals(list));
	const lines = $derived(cashLines(list));
	const groups = $derived(groupCash(list, sort === 'type' ? 'type' : 'period'));
	const left = runway();
</script>

<svelte:head><title>Cash flow · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<LensSwitch label="Money view" items={MONEY_LENSES} at="/records/money" />

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
			meta="Two $1,240 entries to Azbolt · Office, 40 seconds apart."
		/>
		<Row t="warm" title="6:12 PM · $1,240" meta="Office · Azbolt" trailing="Keep" />
		<Row t="warm" title="6:13 PM · $1,240" meta="Office · Azbolt" trailing="Merge" />
		<Btn t="warm" label="Merge into one" />
		<Btn primary={false} label="Keep both — they are different" />
	{:else}
		<Filter label="Period" items={PERIODS} bind:active={period} />
		<Stats
			items={[
				[short(totals.in), 'Cash in'],
				[short(totals.out), 'Cash out'],
				[signed(totals.net), 'Net']
			]}
		/>
		<Tabs items={['Overview', 'Transactions']} active={tab} onpick={(i) => (tab = i)} />

		{#if tab === 0}
			{#if left.months !== null}
				<Banner
					t="warm"
					title="About {left.months.toFixed(1)} months of runway"
					meta="{money(left.liquid)} liquid, against {money(
						left.monthly
					)} going out a month over the last three."
				/>
			{/if}

			<SectionHead label="Cash in" t="warm" count={lines.in.length} />
			{#each lines.in as l (l.label)}
				<Row
					t="warm"
					title={l.label}
					meta="Cash in · {l.frequency.toLowerCase()}"
					trailing="+{money(l.total)}"
				/>
			{:else}
				<Blank>Nothing has come in this period.</Blank>
			{/each}

			<SectionHead label="Cash out" t="warm" count={lines.out.length} />
			{#each lines.out as l (l.label)}
				<Row
					t="warm"
					title={l.label}
					meta="Cash out · {l.frequency.toLowerCase()}"
					trailing="−{money(l.total)}"
				/>
			{:else}
				<Blank>Nothing has gone out this period.</Blank>
			{/each}
		{:else}
			<Filter label="Group" items={SORTS} bind:active={sort} />
			{#each groups as g (g.heading)}
				<div class="group">
					<h2>{g.heading}</h2>
					<span class="sub">{signed(g.subtotal)}</span>
				</div>
				{#each g.items as t (t.id)}
					<Row
						t={counted(t) ? 'warm' : 'neutral'}
						title={t.label}
						meta="{dayLabel(t.date)} · {sort === 'type' ? t.category : t.type} · {ORGS[t.org]
							?.name ?? t.org}"
						trailing={txAmount(t)}
					/>
				{/each}
			{:else}
				<Blank>No entries in this period.</Blank>
			{/each}
		{/if}

		<Btn t="warm" href="/records/money/amount" label="Add transaction" />
		<Note>
			Net is cash in minus cash out, counting only what has actually moved. It is not profit.
			Receivable, projected, accrued and payable entries are listed, not counted.
		</Note>
		<SourceNote source="fixture" />
	{/if}
</Screen>

<style>
	/* A group heading with its subtotal on the same line: the figure is
	   the reason for grouping, so it is not pushed down into a row. */
	.group {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 2px 2px;
	}
	h2 {
		margin: 0;
		font-family: var(--font-label);
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
	}
	.sub {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
	}
</style>
