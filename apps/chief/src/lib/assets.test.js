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
	cashLines,
	dollars,
	effectiveValue,
	money,
	netWorth,
	netWorthOf,
	nextDue,
	overSoldAssets,
	runway,
	sharePercent,
	short,
	signed,
	staleAfter,
	sumValue,
	valueSummary,
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
