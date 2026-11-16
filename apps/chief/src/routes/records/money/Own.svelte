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
	 * Behind the balances are three kinds of line: money coming in,
	 * payments on what is owed or held (the car loan, upkeep on the
	 * rental), and bills. Chief does not keep everyday spending — the bank
	 * already does. It shows up where it belongs: as the part of the
	 * change in balances that no line accounts for.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import {
		Alert,
		Banner,
		Blank,
		Btn,
		Facts,
		Note,
		Row,
		SectionHead,
		SourceNote,
		Stats
	} from '$lib/kit';
	import { MONEY_LENSES } from '$lib/asset/money-lenses.js';
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
		money,
		moneyAssets,
		moneyCategory,
		runwayFromBalances,
		short,
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

	const tracked = cashTotals(cashFor('month')).net;
	const line = bottomLine(ids, monthStart, now, tracked);
	const run = runwayFromBalances(ids, now);
	/* Owed both ways, and profit, over the year: profit counts what is owed
	   as well as what has moved, so it is read from the lines, not the
	   balances. */
	const position = cashPosition(cashFor('year'));

	/* A balance read long ago says little about today. */
	const stale = accounts.filter((a) => a.valuedDaysAgo !== null && a.valuedDaysAgo > 35);
	const unread = accounts.filter((a) => a.value === null);

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
	<LensSwitch label="Money view" items={MONEY_LENSES} at="/records/money" />

	{#if !cat}
		<Alert
			title="The Money category is missing"
			meta="The server is behind the app. Restart PocketBase so the latest migration applies, then reload."
		/>
	{:else}
		<Stats
			items={[
				[
					short(line.end),
					accounts.length === 1 ? 'In 1 account' : `In ${accounts.length} accounts`
				],
				[line.known ? signed(line.change) : '—', 'This month'],
				[line.known ? signed(line.untracked) : '—', 'Everything else']
			]}
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
		<Btn t="warm" href="/records/assets/new?category={cat.id}" label="Add an account" />

		{#if unread.length || stale.length}
			<Alert
				title={unread.length
					? `${unread.length} ${unread.length === 1 ? 'account has' : 'accounts have'} no balance`
					: `${stale.length} ${stale.length === 1 ? 'balance is' : 'balances are'} over a month old`}
				meta="Open the account and update its balance. Totals use the last one read."
			/>
		{/if}

		{#if line.known}
			<Banner
				t="warm"
				title="Balances {line.change < 0 ? 'fell' : 'rose'} {money(
					Math.abs(line.change)
				)} this month"
				meta="{signed(line.tracked)} is from the lines below. {signed(
					line.untracked
				)} is everything else — everyday spending, which Chief does not itemise."
			/>
		{:else if accounts.length}
			<Blank>
				Update a balance a second time and Chief shows how it moved. One reading is a balance, not
				yet a trend.
			</Blank>
		{/if}

		{#if run.months !== null && run.monthly !== null}
			<Banner
				t="warm"
				title="About {run.months.toFixed(1)} months of runway"
				meta="{money(run.liquid)} in accounts, falling about {money(
					Math.round(run.monthly / 100) * 100
				)} a month over the last {run.days} days."
			/>
		{:else if run.monthly !== null && accounts.length}
			<Banner
				t="warm"
				title="Balances are holding"
				meta="{money(run.liquid)} in accounts, and not falling over the last {run.days} days."
			/>
		{/if}

		<SectionHead label="This year" t="warm" />
		<Facts
			items={[
				{ label: 'Owed to you', value: money(position.owedIn) },
				{ label: 'You owe', value: money(position.owedOut) },
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
