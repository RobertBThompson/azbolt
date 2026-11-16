/**
 * The arithmetic behind every figure Chief shows.
 *
 * These are here because a wrong formula in sample data is an
 * afternoon's work and a wrong formula over real records is a
 * migration. Each test is one rule from the build plan's step 2, and
 * each builds its own small book rather than leaning on the sample
 * records, so a change to the fixtures cannot quietly change a result.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	SHARE_UNITS,
	attention,
	bottomLine,
	cashLines,
	cashPosition,
	cashTotals,
	dollars,
	effectiveValue,
	money,
	netWorth,
	netWorthOf,
	nextDue,
	overSoldAssets,
	ownTransactions,
	runway,
	runwayFromBalances,
	sharePercent,
	short,
	signed,
	staleAfter,
	sumValue,
	valueSummary,
	txAmount,
	valueOn,
	worthByOrganization
} from './assets.js';

/* ── A book to work on ──────────────────────────────────────────────── */

/**
 * @param {Record<string, any>} [over]
 * @returns {any}
 */
const asset = (over = {}) => ({
	name: 'Thing',
	category: 'equipment',
	blurb: '',
	value: dollars(100),
	valuedDaysAgo: 10,
	quantity: 1,
	rights: 'Owned',
	period: '',
	tangibility: 'Tangible',
	liquidity: 'Not liquid',
	inventory: 'Not inventory',
	notes: '',
	spheres: [],
	claims: [],
	endeavors: [],
	storage: '',
	units: SHARE_UNITS,
	parent: null,
	valuation: 'whole',
	...over
});

/**
 * @param {string} ownerId
 * @param {string} ownedId
 * @param {number|null} [units]
 * @param {'asset'|'organization'} [cls]
 * @returns {any}
 */
const owns = (ownerId, ownedId, units = SHARE_UNITS, cls = 'asset') => ({
	id: `${ownerId}-${ownedId}`,
	owner: { cls: 'organization', id: ownerId },
	owned: { cls, id: ownedId },
	role: 'Owner',
	units,
	startValue: null,
	currentValue: null,
	disposable: null,
	since: '',
	claims: 0
});

/**
 * @param {Record<string, any>} [over]
 * @returns {any}
 */
const book = (over = {}) => ({ assets: {}, links: [], liabilities: {}, orgs: {}, ...over });

/* ── Money is cents, and cents are shown ────────────────────────────── */

test('money keeps the cents that are there and drops the ones that are not', () => {
	assert.equal(money(dollars(12.49)), '$12.49');
	assert.equal(money(dollars(485000)), '$485,000');
	assert.equal(money(-1249), '−$12.49');
	assert.equal(money(null), '—');
	assert.equal(signed(-1249), '−$12.49');
	assert.equal(short(dollars(924500)), '$925K');
});

test('a dollar amount with cents survives the round trip', () => {
	assert.equal(dollars(0.07), 7);
	assert.equal(money(dollars(0.07)), '$0.07');
});

/* ── Unknown is not zero ────────────────────────────────────────────── */

test('an asset with no value is counted apart, not as nothing', () => {
	const list = [asset({ id: 'a', value: dollars(100) }), asset({ id: 'b', value: null })];
	const { known, unvalued } = valueSummary(list, {});
	assert.equal(known, dollars(100));
	assert.equal(unvalued, 1);
});

test('an asset with no value asks for one', () => {
	const b = book({ assets: { a: asset({ value: null }) }, links: [owns('o', 'a')] });
	assert.ok(attention('a', b).includes('Needs a value'));
});

/* ── A thing inside a thing is counted once ─────────────────────────── */

test('a collection valued as a whole does not add its parts on top', () => {
	const assets = {
		set: asset({ value: dollars(64000), valuation: 'whole' }),
		piece: asset({ value: dollars(39000), parent: 'set' })
	};
	const list = Object.entries(assets).map(([id, a]) => ({ ...a, id }));
	assert.equal(sumValue(list, assets), dollars(64000));
});

test('a collection valued as its parts adds them up', () => {
	const assets = {
		wreck: asset({ value: null, valuation: 'parts' }),
		engine: asset({ value: dollars(900), parent: 'wreck' }),
		doors: asset({ value: dollars(300), parent: 'wreck' })
	};
	assert.equal(effectiveValue({ ...assets.wreck, id: 'wreck' }, assets), dollars(1200));
});

test('a parent that names itself does not spin', () => {
	const assets = { loop: asset({ valuation: 'parts', parent: 'loop' }) };
	assert.equal(effectiveValue({ ...assets.loop, id: 'loop' }, assets), dollars(100));
});

/* ── Shares are units out of ten thousand ───────────────────────────── */

test('a share reads back as the percentage it was meant to be', () => {
	const assets = { a: asset() };
	assert.equal(sharePercent(owns('o', 'a', 225), assets), 2.25);
	assert.equal(sharePercent(owns('o', 'a', 5000), assets), 50);
	assert.equal(sharePercent(owns('o', 'a', 1), assets), 0.01);
});

test('shares that add up to more than the whole are flagged', () => {
	const b = book({
		assets: { a: asset() },
		links: [owns('one', 'a', 6000), owns('two', 'a', 6000)]
	});
	assert.deepEqual(
		overSoldAssets(b).map((o) => o.id),
		['a']
	);
	assert.ok(attention('a', b).some((w) => w.startsWith('Shares add up to 120%')));
});

/* ── Net worth is per organization, by share ────────────────────────── */

test('half a house is half a house', () => {
	const b = book({
		orgs: { his: {}, hers: {} },
		assets: { house: asset({ value: dollars(400000) }) },
		links: [owns('his', 'house', 5000), owns('hers', 'house', 5000)]
	});
	assert.equal(netWorthOf('his', b), dollars(200000));
	assert.equal(netWorthOf('hers', b), dollars(200000));
	assert.equal(netWorth(b), dollars(400000));
});

test('a thing you only manage is not yours', () => {
	const b = book({
		orgs: { me: {} },
		assets: { racking: asset({ value: dollars(18600) }) },
		links: [{ ...owns('me', 'racking'), role: 'Manager' }]
	});
	assert.equal(netWorthOf('me', b), 0);
});

test('owning an organization counts its net worth once, not its assets again', () => {
	const b = book({
		orgs: { parent: {}, child: {} },
		assets: { kit: asset({ value: dollars(1000) }) },
		links: [owns('child', 'kit'), owns('parent', 'child', SHARE_UNITS, 'organization')],
		liabilities: {
			loan: { name: 'Loan', borrower: 'child', balance: dollars(400), asset: 'kit' }
		}
	});
	assert.equal(netWorthOf('child', b), dollars(600));
	assert.equal(netWorthOf('parent', b), dollars(600));
	// Only the top of the chain is added, so the kit is counted once.
	assert.equal(netWorth(b), dollars(600));
});

test('half an organization is half its net worth', () => {
	const b = book({
		orgs: { parent: {}, child: {} },
		assets: { kit: asset({ value: dollars(1000) }) },
		links: [owns('child', 'kit'), owns('parent', 'child', 5000, 'organization')]
	});
	assert.equal(netWorthOf('parent', b), dollars(500));
});

test('two organizations owning each other stop rather than spin', () => {
	const b = book({
		orgs: { a: {}, b: {} },
		assets: { kit: asset({ value: dollars(100) }) },
		links: [
			owns('a', 'kit'),
			owns('a', 'b', SHARE_UNITS, 'organization'),
			owns('b', 'a', SHARE_UNITS, 'organization')
		]
	});
	assert.equal(netWorthOf('a', b), dollars(100));
});

test('an asset nobody owns is shown on its own row, not dropped', () => {
	const b = book({ orgs: { me: {} }, assets: { orphan: asset({ value: dollars(50) }) } });
	const rows = worthByOrganization(b);
	assert.deepEqual(
		rows.map((r) => [r.org, r.net]),
		[[null, dollars(50)]]
	);
});

/* ── Runway is per organization ─────────────────────────────────────── */

test('a business runway does not lean on the household', () => {
	const b = book({
		orgs: { shop: {}, home: {} },
		assets: {
			till: asset({ value: dollars(300), liquidity: 'Liquid' }),
			savings: asset({ value: dollars(90000), liquidity: 'Liquid' })
		},
		links: [owns('shop', 'till'), owns('home', 'savings')]
	});
	assert.equal(runway(new Date(), 'shop', b).liquid, dollars(300));
	assert.equal(runway(new Date(), 'home', b).liquid, dollars(90000));
});

/* ── Cash in and cash out stay apart ────────────────────────────────── */

test('an expense and an income with one name do not merge', () => {
	const list = [
		{ label: 'Adjustment', type: 'Cash In', amount: dollars(100), frequency: 'Once' },
		{ label: 'Adjustment', type: 'Actual Expense', amount: dollars(40), frequency: 'Once' }
	];
	const { in: inward, out } = cashLines(/** @type {any} */ (list));
	assert.deepEqual(
		inward.map((l) => [l.label, l.total]),
		[['Adjustment', dollars(100)]]
	);
	assert.deepEqual(
		out.map((l) => [l.label, l.total]),
		[['Adjustment', dollars(40)]]
	);
});

/* ── A schedule follows its own agreement ───────────────────────────── */

/** @param {Record<string, any>} over @returns {any} */
const due = (over) => ({ frequency: 'Monthly', dueDay: 1, started: '', ...over });

test('a payment due on the 31st falls on the last day of a short month', () => {
	const d = nextDue(due({ dueDay: 31, started: 'January 2026' }), new Date(2026, 1, 1));
	assert.equal(d.getMonth(), 1);
	assert.equal(d.getDate(), 28);
});

test('a quarterly agreement that began in February is due in February', () => {
	const d = nextDue(
		due({ frequency: 'Quarterly', dueDay: 15, started: 'February 2025' }),
		new Date(2026, 0, 20)
	);
	assert.equal(d.getMonth(), 1);
	assert.equal(d.getDate(), 15);
});

test('a quarterly agreement keeps its own rhythm through the year', () => {
	const l = due({ frequency: 'Quarterly', dueDay: 15, started: 'February 2025' });
	assert.equal(nextDue(l, new Date(2026, 1, 16)).getMonth(), 4);
	assert.equal(nextDue(l, new Date(2026, 5, 1)).getMonth(), 7);
});

test('a due date is never in the past', () => {
	const l = due({ dueDay: 1, started: 'June 2021' });
	const now = new Date(2026, 10, 13);
	assert.ok(nextDue(l, now) >= new Date(2026, 10, 13));
});

/* ── Staleness depends on the kind of thing ─────────────────────────── */

test('a bank balance goes stale long before a house does', () => {
	assert.ok(staleAfter('cash-account') < staleAfter('real-estate'));
	const b = book({
		assets: {
			cash: asset({ category: 'cash-account', valuedDaysAgo: 60 }),
			house: asset({ category: 'real-estate', valuedDaysAgo: 400 })
		},
		links: [owns('o', 'cash'), owns('o', 'house')]
	});
	assert.ok(attention('cash', b).some((w) => w.startsWith('Valued')));
	assert.deepEqual(attention('house', b), []);
});

/* ── An account's own cash ──────────────────────────────────────────── */

/** @param {Partial<import('./assets.js').Tx>} over @returns {import('./assets.js').Tx} */
const entry = (over) => ({
	id: 'e1',
	label: 'Rent',
	org: 'me',
	type: 'Actual Expense',
	category: 'Mortgages, leases',
	amount: 120000,
	frequency: 'Once',
	date: new Date(2026, 0, 31),
	...over
});

test('a one-off entry is listed once, as recorded', () => {
	const out = ownTransactions([entry({})], new Date(2026, 5, 15));
	assert.equal(out.length, 1);
	assert.equal(out[0].type, 'Actual Expense');
});

test('a repeating entry is counted once: later dates are owed or projected, never paid', () => {
	const now = new Date(2026, 3, 10);
	const out = ownTransactions([entry({ frequency: 'Monthly' })], now);
	const paid = out.filter((t) => t.type === 'Actual Expense');
	assert.equal(paid.length, 1, 'only the entry that was recorded has moved');
	assert.equal(cashTotals(out).out, 120000);
	// February and March have come and are owed; April's is still ahead.
	assert.deepEqual(
		out.filter((t) => t.type === 'Payable').map((t) => t.date.getMonth()),
		[2, 1]
	);
	assert.deepEqual(
		out.filter((t) => t.type === 'Projected Expense').map((t) => t.date.getMonth()),
		[3]
	);
});

test('decision 15: a line begun on the 31st falls on the last day of a short month', () => {
	const out = ownTransactions([entry({ frequency: 'Monthly' })], new Date(2026, 3, 10));
	const feb = out.find((t) => t.date.getMonth() === 1);
	assert.equal(feb?.date.getDate(), 28);
	const mar = out.find((t) => t.date.getMonth() === 2);
	assert.equal(mar?.date.getDate(), 31, 'and goes back to the 31st after it');
});

test('decision 15: a quarterly line keeps its own quarter, not the calendar’s', () => {
	const out = ownTransactions(
		[entry({ frequency: 'Quarterly', date: new Date(2026, 1, 10) })],
		new Date(2026, 10, 20)
	);
	assert.deepEqual(
		out.map((t) => t.date.getMonth()).sort((a, b) => a - b),
		[1, 4, 7, 10]
	);
});

test('money expected in is receivable once its day has come', () => {
	const out = ownTransactions(
		[entry({ type: 'Cash In', frequency: 'Monthly', date: new Date(2026, 0, 5) })],
		new Date(2026, 1, 20)
	);
	assert.deepEqual(
		out.map((t) => t.type),
		['Cash Projected', 'Cash Receivable', 'Cash In']
	);
	assert.equal(cashTotals(out).in, 120000);
});

test('a line shows its amount in dollars, not in the cents it is kept in', () => {
	assert.equal(txAmount(entry({ amount: 120000 })), '−$1,200');
	assert.equal(txAmount(entry({ amount: 50050, type: 'Cash In' })), '+$500.50');
});

test('a settled month stops showing as owed, and counts once as paid', () => {
	const now = new Date(2026, 3, 10);
	const rent = entry({ frequency: 'Monthly' });
	const paid = entry({
		id: 'e2',
		frequency: 'Once',
		date: new Date(2026, 2, 2),
		settles: 'e1',
		period: '2026-03'
	});
	const out = ownTransactions([rent, paid], now);
	assert.deepEqual(
		out.filter((t) => t.type === 'Payable').map((t) => t.period),
		['2026-02'],
		'March is settled; February is still owed'
	);
	assert.equal(cashTotals(out).out, 240000, 'January and March, once each');
});

test('decision 9: moved, owed and profit are three different figures', () => {
	const list = [
		entry({ type: 'Cash In', amount: 100000 }),
		entry({ type: 'Cash Receivable', amount: 50000 }),
		entry({ type: 'Cash Projected', amount: 999900 }),
		entry({ type: 'Actual Expense', amount: 30000 }),
		entry({ type: 'Payable', amount: 20000 }),
		entry({ type: 'Accrued Expense', amount: 5000 }),
		entry({ type: 'Projected Expense', amount: 999900 })
	];
	const p = cashPosition(list);
	assert.equal(p.moved.net, 70000, 'cash is out only when paid');
	assert.equal(p.owedIn, 50000);
	assert.equal(p.owedOut, 25000);
	assert.equal(p.profit, 95000, 'earned 1,500 less incurred 550; projections in neither');
});

/* ── Money is an asset: the bottom line from balances ───────────────── */

const reading = (
	/** @type {number} */ m,
	/** @type {number} */ d,
	/** @type {number} */ amount
) => ({
	amount,
	date: new Date(2026, m, d)
});

test('a balance on a day is its latest reading on or before it', () => {
	const values = { bank: [reading(8, 1, 500000), reading(9, 1, 420000), reading(10, 1, 450000)] };
	assert.equal(valueOn('bank', new Date(2026, 9, 15), values), 420000);
	assert.equal(valueOn('bank', new Date(2026, 7, 1), values), null, 'no reading yet');
	assert.equal(valueOn('none', new Date(2026, 9, 15), values), null);
});

test('the bottom line is how the balances moved, split into tracked and the rest', () => {
	const values = {
		bank: [reading(9, 28, 500000), reading(10, 14, 380000)],
		wallet: [reading(9, 1, 100000), reading(10, 10, 110000)]
	};
	// The month so far: balances went 6,000 → 4,900. The car payment (−400) is tracked.
	const b = bottomLine(
		['bank', 'wallet'],
		new Date(2026, 10, 1),
		new Date(2026, 10, 16),
		-40000,
		values
	);
	assert.equal(b.start, 600000);
	assert.equal(b.end, 490000);
	assert.equal(b.change, -110000);
	assert.equal(b.untracked, -70000, 'lunch and everything else, never entered');
	assert.equal(b.known, true);
});

test('an account opened inside the stretch is not mistaken for income', () => {
	const values = { fresh: [reading(10, 5, 250000), reading(10, 12, 240000)] };
	const b = bottomLine(['fresh'], new Date(2026, 10, 1), new Date(2026, 10, 16), 0, values);
	assert.equal(b.change, -10000, 'counted from its first reading, not from zero');
	assert.equal(b.known, true);
});

test('one reading is a balance, not yet a bottom line', () => {
	const values = { bank: [reading(10, 5, 250000)] };
	const b = bottomLine(['bank'], new Date(2026, 10, 1), new Date(2026, 10, 16), 0, values);
	assert.equal(b.end, 250000);
	assert.equal(b.change, 0);
	assert.equal(b.known, false);
});

test('runway comes from the balances and how fast they fall', () => {
	const now = new Date(2026, 10, 16);
	// 9,000 two months ago, 6,000 now: falling about 1,500 a month.
	const values = { bank: [reading(8, 16, 900000), reading(10, 16, 600000)] };
	const r = runwayFromBalances(['bank'], now, values);
	assert.equal(r.liquid, 600000);
	assert.ok(r.monthly !== null && Math.abs(r.monthly - 150000) < 2000, String(r.monthly));
	assert.ok(r.months !== null && Math.abs(r.months - 4) < 0.1, String(r.months));
});

test('balances that hold or grow are not running out', () => {
	const now = new Date(2026, 10, 16);
	const r = runwayFromBalances(['bank'], now, {
		bank: [reading(8, 16, 500000), reading(10, 16, 650000)]
	});
	assert.equal(r.months, null);
	assert.ok((r.monthly ?? 0) < 0);
});

test('a few days between readings is not a trend', () => {
	const now = new Date(2026, 10, 16);
	const r = runwayFromBalances(['bank'], now, {
		bank: [reading(10, 10, 500000), reading(10, 16, 300000)]
	});
	assert.equal(r.liquid, 300000);
	assert.equal(r.months, null);
	assert.equal(r.monthly, null);
});
