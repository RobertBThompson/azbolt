<script>
	/**
	 * Money — an account's own.
	 *
	 * Money is an asset. Each account here — a bank account, cash, a
	 * wallet — is an asset in the fixed Money category, and its value is
	 * its balance, read off the bank or the chain whenever the Chief
	 * looks: daily, weekly, monthly. The history of those readings is
	 * the trend.
	 *
	 * The accounts are the first thing on the screen (Robert, 16 Nov), and
	 * the figure over them is what they add up to: the same values the
	 * rows show, so the two can never disagree. It once added up only
	 * balances with a dated reading behind them, and said $0 above two
	 * accounts holding $61,200.
	 *
	 * Then every summary before any list: how the balances moved this
	 * month, as a labelled panel rather than loose tiles; what is owed,
	 * as a door rather than a switch over the top of the page; and the
	 * year. A list can run long, and a one-line door under it is a door
	 * nobody finds.
	 *
	 * Last, the lines behind the balances: money coming in, payments on
	 * what is owed or held, and bills. Chief does not keep everyday
	 * spending — the bank already does. It shows up as the part of the
	 * change in balances that no line accounts for.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Blank, Btn, Facts, Lead, Note, Row, SectionHead, SourceNote } from '$lib/kit';
	import {
		ASSETS,
		LIABILITIES,
		bottomLine,
		cashFor,
		cashPosition,
		cashTotals,
		dayLabel,
		direction,
		inSentence,
		liabilities,
		money,
		moneyAssets,
		moneyCategory,
		owedMonthly,
		owedTotal,
		runwayFromBalances,
		signed,
		transactions,
		valuesOf
	} from '$lib/assets.js';
	import { book } from '$lib/book.svelte.js';

	const cat = moneyCategory();
	const accounts = moneyAssets();
	const ids = accounts.map((a) => a.id);
	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	/* What the account rows show, added up. */
	const held = accounts.reduce((sum, a) => sum + (a.value ?? 0), 0);

	const tracked = cashTotals(cashFor('month')).net;
	const line = bottomLine(ids, monthStart, now, tracked);
	const run = runwayFromBalances(ids, now);
	/* Owed both ways, and profit, over the year: profit counts what is owed
	   as well as what has moved, so it is read from the lines, not the
	   balances. These are bills and earnings not yet settled, not loan
	   balances, and are labelled so: "You owe" sat under "$344,500 still
	   owed" and read as the same thing. */
	const position = cashPosition(cashFor('year'));

	/* A balance read long ago says little about today. */
	const stale = accounts.filter((a) => a.valuedDaysAgo !== null && a.valuedDaysAgo > 35);
	const unread = accounts.filter((a) => a.value === null);

	/** @type {{ label: string, value: string }[]} */
	const month = [
		...(line.known
			? [
					{ label: 'Balances moved', value: signed(line.change) },
					{ label: 'Payments and income', value: signed(line.tracked) },
					{ label: 'Everyday, not itemised', value: signed(line.untracked) }
				]
			: []),
		...(run.monthly !== null && run.months !== null
			? [
					{
						label: 'Falling',
						value: `about ${money(Math.round(run.monthly / 100) * 100)} a month`
					},
					{ label: 'Runway', value: `about ${run.months.toFixed(1)} months` }
				]
			: run.monthly !== null
				? [{ label: 'Runway', value: 'Balances are holding' }]
				: [])
	];

	const all = transactions();
	const lines = all.filter((t) => !t.of);
	const coming = lines.filter((t) => direction(t.type) === 'in');
	const going = lines.filter((t) => direction(t.type) === 'out');
	const groups = [
		{
			label: 'Coming in',
			rows: coming,
			empty: 'Paychecks, rent from a rental, client payments.'
		},
		{
			label: 'Payments on what you owe or hold',
			rows: going.filter((t) => t.liability || t.asset),
			empty: 'A car loan, a mortgage, upkeep on something you own.'
		},
		{
			label: 'Bills',
			rows: going.filter((t) => !t.liability && !t.asset),
			empty: 'Power, phone, insurance — the ones that come every month.'
		}
	];
	const due = all.filter(
		(t) => ['Payable', 'Cash Receivable', 'Accrued Expense'].includes(t.type) && t.date <= now
	);
	const owed = liabilities();

	/** @param {number} n @param {string} one @param {string} many */
	const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

	/** @param {import('$lib/assets.js').Tx} t */
	const about = (t) =>
		[
			t.frequency === 'Once' ? inSentence(dayLabel(t.date)) : t.frequency.toLowerCase(),
			t.account && ASSETS[t.account] ? `through ${ASSETS[t.account].name}` : '',
			t.liability && LIABILITIES[t.liability]
				? `for ${LIABILITIES[t.liability].name}`
				: t.asset && ASSETS[t.asset]
					? `for ${ASSETS[t.asset].name}`
					: ''
		]
			.filter(Boolean)
			.join(' · ');
	/** @param {import('$lib/assets.js').Tx} t */
	const amountOf = (t) => `${direction(t.type) === 'in' ? '+' : '−'}${money(t.amount)}`;
</script>

<svelte:head><title>Money · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	{#if !cat}
		<Alert
			title="The Money category is missing"
			meta="The server is behind the app. Restart PocketBase so the latest migration applies, then reload."
		/>
	{:else}
		<Lead
			figure={money(held)}
			label={accounts.length
				? `In ${count(accounts.length, 'account', 'accounts')}`
				: 'No accounts yet'}
			meta={line.known
				? `${line.change < 0 ? 'Down' : 'Up'} ${money(Math.abs(line.change))} this month`
				: ''}
		/>

		<SectionHead label="Accounts" t="warm" count={accounts.length} />
		{#each accounts as a (a.id)}
			<Row
				t={a.value === null || (a.valuedDaysAgo ?? 0) > 35 ? 'alert' : 'warm'}
				href="/records/assets/{a.id}"
				title={a.name}
				meta={a.value === null
					? 'No balance read yet'
					: `Balance as of ${inSentence(dayLabel(valuesOf(a.id).at(-1)?.date ?? now))}`}
				trailing={a.value === null ? '—' : money(a.value)}
			/>
		{:else}
			<Blank>
				No accounts yet. Add the ones that matter: a bank account, cash on hand, a wallet.
			</Blank>
		{/each}
		{#if unread.length || stale.length}
			<Blank>
				A red mark is a balance not read yet, or read over a month ago. Open the account to update
				it; totals use the last one read.
			</Blank>
		{/if}
		<Btn
			t="warm"
			primary={!accounts.length}
			href="/records/assets/new?category={cat.id}"
			label="Add an account"
		/>

		{#if accounts.length}
			<SectionHead label="This month" t="warm" />
			{#if month.length}
				<Facts items={month} />
			{:else}
				<Blank>
					Update a balance a second time and Chief shows how it moved. One reading is a balance, not
					yet a trend.
				</Blank>
			{/if}
		{/if}

		<SectionHead label="Liabilities" t="warm" count={owed.length} />
		<Row
			t="warm"
			icon="owed"
			hue="night"
			href="/records/money/liabilities"
			title={owed.length ? `${money(owedTotal())} still owed` : 'Nothing owed'}
			meta={owed.length
				? `${count(owed.length, 'liability', 'liabilities')} · ${money(owedMonthly())} a month`
				: 'Loans, a mortgage, anything you have yet to pay off'}
			trailing="›"
		/>

		<SectionHead label="This year" t="warm" />
		<Facts
			items={[
				{ label: 'Earned, not yet in', value: money(position.owedIn) },
				{ label: 'Billed, not yet paid', value: money(position.owedOut) },
				{ label: 'Profit', value: signed(position.profit) }
			]}
		/>

		{#if due.length}
			<SectionHead label="Due, not yet recorded" t="alert" count={due.length} />
			{#each due as t (t.id)}
				<Row
					t="alert"
					href="/records/money/settle/{encodeURIComponent(t.id)}"
					title={t.label}
					meta="{t.type} · {inSentence(dayLabel(t.date))}"
					trailing={amountOf(t)}
				/>
			{/each}
		{/if}

		{#each groups as g (g.label)}
			<SectionHead label={g.label} t="warm" count={g.rows.length} />
			{#each g.rows as t (t.id)}
				<Row
					t="warm"
					href="/records/money/entry/{t.id}"
					title={t.label}
					meta={about(t)}
					trailing={amountOf(t)}
				/>
			{:else}
				<Blank>None yet. {g.empty}</Blank>
			{/each}
		{/each}
		<Btn t="warm" href="/records/money/amount" label="Add a payment" />

		<Note>
			Chief keeps balances, money coming in, payments on what you hold or owe, and bills. It does
			not keep everyday spending; your bank does. Update each balance as often as suits you, and the
			difference no payment explains is shown as one figure.
		</Note>
	{/if}
	<SourceNote source={book.source} error={book.error} />
</Screen>
