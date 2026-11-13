import { ORGS } from './data.js';

/**
 * The asset book — everything behind the Asset tab, in one place.
 *
 * Shaped like the Layer 4 ERD (asset_categories, assets, ownerships,
 * liabilities) so that replacing these fixtures with live rows is a
 * change of source and not of screens. Cash and asset events have no
 * confirmed table yet; they follow the lexicon's field lists.
 *
 * The rules the screens rely on live here rather than in the screens:
 *
 *   · Everything is an asset if it is not a person. A person is never an
 *     asset; the contract that binds one is.
 *   · Every asset carries a value, because net worth is a number Chief
 *     always knows — assets minus liabilities, never "on request".
 *   · An asset can be owned by an asset, but every chain has to end at
 *     an organization. One that does not is flagged, not hidden.
 *   · A liability is debt against a specific asset, owed to a specific
 *     organization.
 *   · Net cash is Cash In minus Actual Expense. It is not profit.
 *
 * Every screen reads its numbers from the functions below, so the hub,
 * the lists and the detail pages cannot disagree with each other.
 */

/* ── Money and dates ────────────────────────────────────────────────── */

const DAY = 86_400_000;

/**
 * Every amount in this book is an integer number of cents.
 *
 * Dollars as floating point lose a cent here and there and the loss
 * compounds through a total; and `money()` used to round to whole
 * dollars, so $12.49 was shown as $12 and a cheque never matched a
 * statement. Cents in, formatted out.
 *
 * Fixture figures below are written in dollars for readability and
 * converted once, at the point the book is built.
 * @param {number} n
 */
export const dollars = (n) => Math.round(n * 100);

/**
 * Cents as a person would write them. Whole dollars keep their cents
 * off, because "$485,000.00" on a house is noise; anything with cents
 * shows them, because that is the figure that has to match.
 * @param {number|null|undefined} cents
 */
export function money(cents) {
	if (cents === null || cents === undefined) return '—';
	const sign = cents < 0 ? '−' : '';
	const a = Math.abs(Math.round(cents));
	const whole = Math.floor(a / 100).toLocaleString('en-US');
	const rest = a % 100;
	return rest === 0 ? `${sign}$${whole}` : `${sign}$${whole}.${String(rest).padStart(2, '0')}`;
}

/**
 * For the three-up stat strip, where a seven-figure sum does not fit.
 * @param {number|null|undefined} cents
 */
export function short(cents) {
	if (cents === null || cents === undefined) return '—';
	const a = Math.abs(cents) / 100;
	const sign = cents < 0 ? '−' : '';
	if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2).replace(/\.?0+$/, '')}M`;
	if (a >= 1e4) return `${sign}$${Math.round(a / 1e3)}K`;
	return `${sign}${money(Math.round(a * 100)).replace('−', '')}`;
}

/** @param {number} cents */
export const signed = (cents) => `${cents < 0 ? '−' : '+'}${money(Math.abs(cents))}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** @param {Date} d */
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * A date as a person would say it from today: "Today", "Friday",
 * "3 days ago", "20 Nov", "Aug 2025".
 * @param {Date} d
 * @param {Date} [now]
 */
export function dayLabel(d, now = new Date()) {
	const diff = Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / DAY);
	if (diff === 0) return 'Today';
	if (diff === 1) return 'Tomorrow';
	if (diff === -1) return 'Yesterday';
	if (diff > 1 && diff < 7) return WEEKDAYS[d.getDay()];
	if (diff < -1 && diff > -14) return `${-diff} days ago`;
	if (d.getFullYear() === now.getFullYear()) return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
	return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * "Today" mid-sentence is "today"; "3 Aug" and "Friday" stay as they are.
 * @param {string} label
 */
export const inSentence = (label) =>
	['Today', 'Tomorrow', 'Yesterday'].includes(label) ? label.toLowerCase() : label;

/**
 * Fixture dates are stored as an age in days, so the prototype reads as
 * current whenever it is opened instead of drifting into the past.
 * @param {number} n
 * @param {Date} [now]
 */
const daysAgo = (n, now = new Date()) => new Date(startOfDay(now).getTime() - n * DAY);

/** @param {string} name */
export const slug = (name) =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

/* ── Categories ─────────────────────────────────────────────────────── */

/**
 * A list the Chief edits, not an enum. This is the lexicon's set, plus
 * Art, which is the kind of thing a Chief adds for themselves.
 */
const CATEGORY_NAMES = [
	'Real estate',
	'Vehicle',
	'Equipment',
	'Art',
	'Cash account',
	'Savings account',
	'Investment',
	'Stock',
	'Copyright',
	'Patent',
	'Trademark',
	'Contract',
	'MOU',
	'Company goodwill',
	'Accounts receivable',
	'Prepaid expense',
	'Product',
	'Services',
	'Skills',
	'Consulting',
	'Labor',
	'Inventory',
	'Office space',
	'Office supplies',
	'Department'
];

/** @type {{ id: string, name: string }[]} */
export const ASSET_CATEGORIES = CATEGORY_NAMES.map((name) => ({ id: slug(name), name }));

/** @param {string} id */
export const categoryName = (id) => ASSET_CATEGORIES.find((c) => c.id === id)?.name ?? id;

/* ── Assets ─────────────────────────────────────────────────────────── */

/**
 * @typedef {'Ownership token'|'Title / provenance'|'Agreement'|'Statement'|
 *           'Storage record'|'Insurance'|'Movement authorization'} ClaimKind
 * @typedef {{ kind: ClaimKind, detail: string, verified: boolean }} Claim
 *
 * @typedef {{
 *   name: string, category: string, blurb: string,
 *   value: number|null, valuedDaysAgo: number|null,
 *   quantity: number, rights: string, period: string,
 *   tangibility: 'Tangible'|'Intangible',
 *   liquidity: 'Liquid'|'Not liquid',
 *   inventory: 'Inventory'|'Not inventory',
 *   notes: string, spheres: string[], claims: Claim[],
 *   endeavors: string[], storage: string,
 *   units?: number, parent?: string|null,
 *   valuation?: 'whole'|'parts',
 *   movement?: string, letGo?: boolean
 * }} Asset
 */

/**
 * Ownership of one asset is divided into this many units by default.
 *
 * Percentages cannot carry a share to the hundredth without fractions:
 * 2.25% of 1,000 units is 22.5 of them. Out of 10,000, every share to
 * one hundredth of a percent is a whole number — 2.25% is 225 units,
 * half is 5,000, and the smallest share Chief can record is 1.
 */
export const SHARE_UNITS = 10_000;

/** Claims that speak to who holds the thing, as opposed to where it is. */
const OWNERSHIP_CLAIMS = ['Ownership token', 'Title / provenance', 'Agreement', 'Statement'];

/**
 * The sample assets, with figures written in dollars. RAW is private;
 * ASSETS below is the same book with every figure in cents.
 * @type {Record<string, Asset>}
 */
const RAW_ASSETS = {
	'family-home': {
		name: 'Family home',
		category: 'real-estate',
		blurb: 'Primary residence.',
		value: 485000,
		valuedDaysAgo: 120,
		quantity: 1,
		rights: 'Owned',
		period: 'Since June 2021',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['family', 'spouse', 'children'],
		claims: [
			{ kind: 'Title / provenance', detail: 'Deed recorded', verified: true },
			{ kind: 'Insurance', detail: 'Homeowner policy · active', verified: true }
		],
		endeavors: [],
		storage: ''
	},
	'family-car': {
		name: 'Family car',
		category: 'vehicle',
		blurb: 'Used for both family and work — one record, not two.',
		value: 24500,
		valuedDaysAgo: 60,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['family', 'business'],
		claims: [
			{ kind: 'Title / provenance', detail: 'Title on file', verified: true },
			{ kind: 'Insurance', detail: 'Auto policy · active', verified: true }
		],
		endeavors: [],
		storage: ''
	},
	'delivery-van': {
		name: 'Delivery van',
		category: 'vehicle',
		blurb: 'Carries the build-out crew and their materials.',
		value: 31000,
		valuedDaysAgo: 200,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [
			{ kind: 'Title / provenance', detail: 'Title held by the lender', verified: true },
			{ kind: 'Insurance', detail: 'Commercial policy · active', verified: true }
		],
		endeavors: ['build'],
		storage: ''
	},
	'storage-racking': {
		name: 'Storage racking',
		category: 'equipment',
		blurb: 'Leased, not owned: Azbolt runs it and answers for it.',
		value: 18600,
		valuedDaysAgo: 30,
		quantity: 42,
		rights: 'Leased',
		period: '36 months from February',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [
			{ kind: 'Agreement', detail: 'Lease agreement · signed', verified: true },
			{ kind: 'Storage record', detail: 'Installed at the storage site', verified: true }
		],
		endeavors: ['build'],
		storage: 'Installed · storage site'
	},
	'azbolt-operating': {
		name: 'Azbolt operating account',
		category: 'cash-account',
		blurb: 'Where the company is paid and pays from.',
		value: 42300,
		valuedDaysAgo: 2,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Intangible',
		liquidity: 'Liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [{ kind: 'Statement', detail: 'Latest statement on file', verified: true }],
		endeavors: [],
		storage: ''
	},
	'household-savings': {
		name: 'Household savings',
		category: 'savings-account',
		blurb: 'Set aside; not for running costs.',
		value: 18900,
		valuedDaysAgo: 12,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Intangible',
		liquidity: 'Liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['family'],
		claims: [{ kind: 'Statement', detail: 'Latest statement on file', verified: true }],
		endeavors: [],
		storage: ''
	},
	'build-suite-code': {
		name: 'Build Suite source code',
		category: 'copyright',
		blurb: 'The software itself, and the right to license it.',
		value: 150000,
		valuedDaysAgo: 90,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Intangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business', 'career'],
		claims: [{ kind: 'Agreement', detail: 'Assignment to Azbolt · signed', verified: true }],
		endeavors: ['build', 'website'],
		storage: ''
	},
	'carmen-contract': {
		name: 'Operations contract — Carmen Ruiz',
		category: 'contract',
		blurb: 'A person is never an asset. The contract that binds one is.',
		value: null,
		valuedDaysAgo: null,
		quantity: 1,
		rights: 'Contracted',
		period: 'January to December',
		tangibility: 'Intangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [{ kind: 'Agreement', detail: 'Signed agreement', verified: true }],
		endeavors: ['build'],
		storage: ''
	},
	'nfta-014': {
		name: 'NFTA artwork #014',
		category: 'art',
		blurb: 'Tangible artwork with a tokenised claim.',
		value: 48000,
		valuedDaysAgo: 102,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [
			{ kind: 'Ownership token', detail: 'Verified · wallet linked', verified: true },
			{ kind: 'Title / provenance', detail: '2 documents', verified: true },
			{ kind: 'Storage record', detail: 'Secure facility', verified: true },
			{ kind: 'Insurance', detail: 'Active policy', verified: true },
			{ kind: 'Movement authorization', detail: 'No open movement', verified: false }
		],
		endeavors: [],
		storage: 'Secure storage · no transit'
	},
	'nfta-022': {
		name: 'NFTA artwork #022',
		category: 'art',
		blurb: 'Held inside the Studio collection.',
		parent: 'studio-collection',
		value: 39000,
		valuedDaysAgo: 102,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [
			{ kind: 'Ownership token', detail: 'Verified · wallet linked', verified: true },
			{ kind: 'Storage record', detail: 'Secure facility', verified: true },
			{ kind: 'Movement authorization', detail: 'Requested · not yet approved', verified: false }
		],
		endeavors: [],
		storage: 'Secure storage · movement requested',
		movement: 'Movement pending'
	},
	'studio-collection': {
		name: 'Studio collection',
		category: 'art',
		blurb: 'Four linked works held together.',
		valuation: 'whole',
		value: 64000,
		valuedDaysAgo: 425,
		quantity: 4,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [
			{ kind: 'Title / provenance', detail: 'Partially documented', verified: false },
			{ kind: 'Storage record', detail: 'Secure facility', verified: true }
		],
		endeavors: [],
		storage: 'Secure storage'
	},
	'upright-piano': {
		name: 'Upright piano',
		category: 'equipment',
		blurb: 'In the front room. Nobody has been written down as its owner.',
		value: 3200,
		valuedDaysAgo: 300,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['family', 'hobby'],
		claims: [],
		endeavors: [],
		storage: ''
	},
	'office-printer': {
		name: 'Office printer',
		category: 'equipment',
		blurb: 'Sold when the office went paperless.',
		value: 0,
		valuedDaysAgo: 20,
		quantity: 1,
		rights: 'Owned',
		period: '',
		tangibility: 'Tangible',
		liquidity: 'Not liquid',
		inventory: 'Not inventory',
		notes: '',
		spheres: ['business'],
		claims: [],
		endeavors: [],
		storage: '',
		letGo: true
	}
};

/**
 * Every asset, in cents, with the two fields decision 6 asked for:
 * `parent` for an asset that sits inside another, and `valuation` for
 * whether a thing is worth what it says or the sum of its parts.
 * Defaults keep a plain asset plain.
 * @type {Record<string, Asset>}
 */
export const ASSETS = Object.fromEntries(
	Object.entries(RAW_ASSETS).map(([id, a]) => [
		id,
		{
			...a,
			value: a.value == null ? null : dollars(a.value),
			units: a.units ?? SHARE_UNITS,
			parent: a.parent ?? null,
			valuation: a.valuation ?? 'whole'
		}
	])
);

/** @typedef {Asset & { id: string }} AssetRow */

/** Assets still held. One that has been let go keeps its record and its history. */
export function activeAssets() {
	return Object.entries(ASSETS)
		.filter(([, a]) => !a.letGo)
		.map(([id, a]) => /** @type {AssetRow} */ ({ id, ...a }));
}

/** @param {string} id */
export const assetOf = (id) => ASSETS[id] ?? null;

/**
 * What one asset is worth on its own terms.
 *
 * Decision 6: an asset is valued as a whole by default, so a car is
 * worth what the car is worth and its parts are not added on top. An
 * asset marked `parts` is worth the sum of the assets that name it as
 * their parent, which is what a junk car or an unpriced collection
 * needs. Either way a thing is counted one way, never both.
 *
 * @param {Asset & { id?: string }} a
 * @param {Record<string, Asset>} [assets]
 * @param {Set<string>} [seen]  guards a parent loop
 * @returns {number|null}  cents, or null when nothing is known
 */
export function effectiveValue(a, assets = ASSETS, seen = new Set()) {
	if (a.valuation !== 'parts') return a.value ?? null;
	const id = a.id ?? Object.keys(assets).find((k) => assets[k] === a);
	if (!id || seen.has(id)) return a.value ?? null;
	seen.add(id);
	let total = null;
	for (const [cid, child] of Object.entries(assets)) {
		if (child.parent !== id || child.letGo) continue;
		const v = effectiveValue({ ...child, id: cid }, assets, seen);
		if (v !== null) total = (total ?? 0) + v;
	}
	return total ?? a.value ?? null;
}

/**
 * The known total of a list, and how many of its assets have no value.
 *
 * Decision 7: an asset with no value is not worth nothing, so it is
 * left out of the total and counted separately. A total that quietly
 * read unknown as zero made net worth look settled when it was not.
 * An asset held inside another in the same list is skipped, because
 * its value is already inside its parent's.
 *
 * @param {(Asset & { id?: string })[]} list
 * @param {Record<string, Asset>} [assets]
 */
export function valueSummary(list, assets = ASSETS) {
	const held = new Set(list.map((a) => a.id).filter(Boolean));
	let known = 0;
	let unvalued = 0;
	for (const a of list) {
		if (a.parent && held.has(a.parent)) continue;
		const v = effectiveValue(a, assets);
		if (v === null) unvalued += 1;
		else known += v;
	}
	return { known, unvalued };
}

/**
 * The part of a list's value that is known. Kept as its own name
 * because most callers want the figure; the ones that have to say how
 * complete it is use valueSummary.
 * @param {(Asset & { id?: string })[]} list
 * @param {Record<string, Asset>} [assets]
 */
export const sumValue = (list, assets = ASSETS) => valueSummary(list, assets).known;

/**
 * Verified, Insured, Stored — read off the claims, never set by hand.
 * @param {Asset} a
 */
export function statuses(a) {
	const out = [];
	if (a.claims.some((c) => c.verified && OWNERSHIP_CLAIMS.includes(c.kind))) out.push('Verified');
	if (a.claims.some((c) => c.verified && c.kind === 'Insurance')) out.push('Insured');
	if (a.claims.some((c) => c.verified && c.kind === 'Storage record')) out.push('Stored');
	return out;
}

/** @param {Asset} a */
export const isVerified = (a) => statuses(a).includes('Verified');

/** Categories that hold something, with their count and sum, then the empty ones. */
export function categorySummary() {
	const assets = activeAssets();
	const rows = ASSET_CATEGORIES.map((c) => {
		const inIt = assets.filter((a) => a.category === c.id);
		return {
			...c,
			count: inIt.length,
			value: sumValue(inIt),
			attention: inIt.filter((a) => attention(a.id).length).length
		};
	});
	return { used: rows.filter((r) => r.count > 0), empty: rows.filter((r) => r.count === 0) };
}

/* ── Ownership ──────────────────────────────────────────────────────── */

/**
 * The join between assets and organizations, and between organizations.
 * Either end may be an organization or an asset; the owned end may never
 * be a person, because a person is never an asset.
 *
 * @typedef {{ cls: 'organization'|'asset', id: string }} Node
 * @typedef {'Owner'|'Manager'|'Guarantor'} OwnerType
 * @typedef {{
 *   id: string, owner: Node, owned: Node, role: OwnerType,
 *   units: number|null, startValue: number|null, currentValue: number|null,
 *   disposable: number|null, since: string, claims: number
 * }} Link
 */

/** The roles a link can carry. Owner and Manager are the two in the schema. */
export const OWNER_TYPES = ['Owner', 'Manager', 'Guarantor'];

/**
 * What is known about a link between two organizations beyond the bare
 * fact of it. The fact itself is ORGS.controlledBy, so the Directory and
 * the Ownership view are reading the same relationship and cannot drift.
 * @type {Record<string, Partial<Link>>}
 */
const ORG_LINK_DETAIL = {
	'tn>azbolt': {
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 50000,
		/* No stored current value: what TN's share of Azbolt is worth is
		   Azbolt's own net worth times the share, and a second copy of a
		   figure is a second figure to go stale. */
		since: 'January 2021',
		claims: 3
	},
	'tn>save': { role: 'Manager', since: 'March 2022', claims: 1 },
	'azbolt>storage': { role: 'Manager', since: 'February', claims: 0 },
	'ward>council': { role: 'Manager', since: 'Standing', claims: 0 }
};

/**
 * Asset links. `currentValue` is left out on purpose: for an asset it is
 * the asset's own value times the share, and storing it twice is how the
 * two would come to disagree.
 * @type {{ owner: Node, owned: string, role: OwnerType, units: number|null, startValue: number|null, since: string, claims: number }[]}
 */
const ASSET_LINKS = [
	{
		owner: { cls: 'organization', id: 'tn' },
		owned: 'family-home',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 410000,
		since: 'June 2021',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'tn' },
		owned: 'family-car',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 31000,
		since: 'May 2024',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'tn' },
		owned: 'household-savings',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 5000,
		since: 'January 2022',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'delivery-van',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 38000,
		since: 'February 2025',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'storage-racking',
		role: 'Manager',
		units: null,
		startValue: null,
		since: 'February',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'azbolt-operating',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 10000,
		since: 'January 2021',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'build-suite-code',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 20000,
		since: 'June 2025',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'carmen-contract',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: null,
		since: 'January',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'ame' },
		owned: 'nfta-014',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 36000,
		since: 'January',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'ame' },
		owned: 'studio-collection',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 58000,
		since: 'September 2025',
		claims: 1
	},
	// An asset owning an asset. The chain still ends at AME.
	{
		owner: { cls: 'asset', id: 'studio-collection' },
		owned: 'nfta-022',
		role: 'Owner',
		units: SHARE_UNITS,
		startValue: 30000,
		since: 'February',
		claims: 1
	}
];

/** @returns {Link[]} */
function buildLinks() {
	/** @type {Link[]} */
	const out = [];
	for (const [id, o] of Object.entries(ORGS)) {
		if (!o.controlledBy) continue;
		const d = ORG_LINK_DETAIL[`${o.controlledBy}>${id}`] ?? {};
		out.push({
			id: `${o.controlledBy}-${id}`,
			owner: { cls: 'organization', id: o.controlledBy },
			owned: { cls: 'organization', id },
			role: d.role ?? 'Manager',
			units: d.units ?? null,
			startValue: d.startValue == null ? null : dollars(d.startValue),
			currentValue: d.currentValue == null ? null : dollars(d.currentValue),
			disposable: null,
			since: d.since ?? '',
			claims: d.claims ?? 0
		});
	}
	for (const l of ASSET_LINKS) {
		const a = ASSETS[l.owned];
		/* Units out of the asset's own total, so a share is exact to a
		   hundredth of a percent and never a floating-point fraction. */
		const share = l.units === null || !a ? null : l.units / (a.units ?? SHARE_UNITS);
		const held = a?.value == null || share === null ? null : Math.round(a.value * share);
		out.push({
			id: `${l.owner.id}-${l.owned}`,
			owner: l.owner,
			owned: { cls: 'asset', id: l.owned },
			role: l.role,
			units: l.units,
			startValue: l.startValue == null ? null : dollars(l.startValue),
			// A manager holds no share of the value; an owner holds theirs.
			currentValue: l.role === 'Owner' ? held : null,
			disposable: a?.liquidity === 'Liquid' && l.role === 'Owner' ? held : null,
			since: l.since,
			claims: l.claims
		});
	}
	return out;
}

/** @type {Link[]} */
export const LINKS = buildLinks();

/**
 * What to put where the amount goes.
 *
 * Decision 7: an unvalued asset is not worth nothing and does not read
 * as a dash either. It says what it needs, so it can be fixed from the
 * list it is in.
 * @param {number|null|undefined} cents
 */
export const amountOrAsk = (cents) =>
	cents === null || cents === undefined ? 'Needs value' : money(cents);

/**
 * A link's share as a percentage, for showing. Units are the stored
 * truth; a percentage is how a person reads it. Trailing zeros go, so
 * half reads "50%" and a quarter of a percent "0.25%".
 * @param {Link} l
 * @param {Record<string, Asset>} [assets]
 */
export function sharePercent(l, assets = ASSETS) {
	if (l.units === null) return null;
	const total = (l.owned.cls === 'asset' ? assets[l.owned.id]?.units : SHARE_UNITS) ?? SHARE_UNITS;
	if (!total) return null;
	return Number(((l.units / total) * 100).toFixed(2));
}

/**
 * The links the Asset tab is about: who owns what, and who manages a
 * thing they do not own. An organization controlling another with no
 * share in it is governance, which the Directory's Structure view
 * shows; counting it here made a ward look like it held its council.
 * @param {Link[]} [links]
 */
export const ownershipLinks = (links = LINKS) =>
	links.filter((l) => l.owned.cls === 'asset' || l.units !== null);

/** @param {string} id */
export const linkOf = (id) => LINKS.find((l) => l.id === id) ?? null;

/** @param {Node} n */
export function nodeName(n) {
	return n.cls === 'organization' ? (ORGS[n.id]?.name ?? n.id) : (ASSETS[n.id]?.name ?? n.id);
}

/** Where a node's own record lives. Organizations are in the Directory. */
/** @param {Node} n */
export function nodeHref(n) {
	return n.cls === 'organization' ? `/organizations/${n.id}` : `/records/assets/${n.id}`;
}

/** @param {Node} n */
export const ownersOf = (n, links = LINKS) =>
	links.filter((l) => l.owned.cls === n.cls && l.owned.id === n.id);

/** @param {Node} n */
export const ownedBy = (n, links = LINKS) =>
	links.filter((l) => l.owner.cls === n.cls && l.owner.id === n.id);

/**
 * Follows an asset's owners upward until organizations are reached.
 * Empty means the chain never gets to one — which is the thing the
 * lexicon says may not be left standing.
 *
 * @param {string} assetId
 * @param {Set<string>} [seen]
 * @returns {string[]} organization ids
 */
export function controllingOrgs(assetId, links = LINKS, seen = new Set()) {
	if (seen.has(assetId)) return [];
	seen.add(assetId);
	/** @type {string[]} */
	const out = [];
	for (const l of ownersOf({ cls: 'asset', id: assetId }, links)) {
		if (l.owner.cls === 'organization') out.push(l.owner.id);
		else out.push(...controllingOrgs(l.owner.id, links, seen));
	}
	return [...new Set(out)];
}

/**
 * Who to name as the owner on an asset's own page: the direct holder,
 * which may be another asset.
 * @param {string} assetId
 */
export function ownerLine(assetId) {
	const direct = ownersOf({ cls: 'asset', id: assetId });
	if (!direct.length) return 'No owner recorded';
	return direct
		.map((l) => (l.role === 'Owner' ? nodeName(l.owner) : `${nodeName(l.owner)} · ${l.role}`))
		.join(', ');
}

/**
 * Why an asset needs attention, in words. Attention is a count with
 * reasons, never a badge with no explanation.
 *
 * @param {string} assetId
 * @returns {string[]}
 */
/**
 * How long a value stays believable, by what kind of thing it is.
 *
 * One rule for everything flagged a house at a year old and let a bank
 * balance sit for eleven months without a word. A balance is stale in
 * a month; land moves slowly.
 * @type {Record<string, number>}
 */
const STALE_AFTER_DAYS = {
	'cash-account': 31,
	'savings-account': 31,
	investment: 92,
	stock: 31,
	'accounts-receivable': 62,
	inventory: 92,
	vehicle: 365,
	equipment: 365,
	'real-estate': 730,
	art: 730,
	copyright: 1095,
	patent: 1095,
	trademark: 1095
};

/**
 * The age at which this kind of asset's value needs looking at again.
 * @param {string} category
 */
export const staleAfter = (category) => STALE_AFTER_DAYS[category] ?? 365;

/**
 * Shares in one asset that add up to more than the asset has.
 * @param {Book} [book]
 */
export function overSoldAssets(book = sample) {
	/** @type {{ id: string, units: number, total: number }[]} */
	const out = [];
	for (const [id, a] of Object.entries(book.assets)) {
		const total = a.units ?? SHARE_UNITS;
		const held = book.links
			.filter((l) => l.role === 'Owner' && l.owned.cls === 'asset' && l.owned.id === id)
			.reduce((n, l) => n + (l.units ?? 0), 0);
		if (held > total) out.push({ id, units: held, total });
	}
	return out;
}

/**
 * Why an asset needs looking at, in words, or an empty list if it does
 * not. Reasons, never a bare badge.
 * @param {string} assetId
 * @param {Book} [book]
 */
export function attention(assetId, book = sample) {
	const a = book.assets[assetId];
	if (!a || a.letGo) return [];
	/** @type {string[]} */
	const why = [];
	if (!a.parent && !controllingOrgs(assetId, book.links).length)
		why.push('No owner — it has to end up with an organization');
	const over = overSoldAssets(book).find((o) => o.id === assetId);
	if (over) {
		why.push(`Shares add up to ${Number(((over.units / over.total) * 100).toFixed(2))}% of it`);
	}
	const v = effectiveValue({ ...a, id: assetId }, book.assets);
	if (v === null) why.push('Needs a value');
	else if (a.valuedDaysAgo !== null && a.valuedDaysAgo > staleAfter(a.category)) {
		const months = Math.round(a.valuedDaysAgo / 30.4);
		why.push(`Valued ${months} ${months === 1 ? 'month' : 'months'} ago`);
	}
	if (a.movement) why.push(a.movement);
	return why;
}

export const needingAttention = () => activeAssets().filter((a) => attention(a.id).length);

/**
 * The whole graph as indented rows: organizations nobody else holds at
 * the root, what each holds beneath it. Assets with no chain to an
 * organization come back separately, so the tree can say so.
 *
 * @returns {{ rows: { node: Node, link: Link|null, depth: number }[], loose: AssetRow[] }}
 */
export function ownershipTree() {
	/** @type {{ node: Node, link: Link|null, depth: number }[]} */
	const rows = [];
	/** @param {Node} node @param {Link|null} link @param {number} depth @param {Set<string>} path */
	const walk = (node, link, depth, path) => {
		const key = `${node.cls}:${node.id}`;
		if (path.has(key)) return;
		rows.push({ node, link, depth });
		const next = new Set(path).add(key);
		const kids = ownedBy(node).sort((a, b) => a.owned.cls.localeCompare(b.owned.cls) * -1);
		for (const k of kids) walk(k.owned, k, depth + 1, next);
	};
	const roots = Object.keys(ORGS).filter((id) => {
		const n = /** @type {Node} */ ({ cls: 'organization', id });
		return ownedBy(n).length > 0 && ownersOf(n).length === 0;
	});
	for (const id of roots) walk({ cls: 'organization', id }, null, 0, new Set());
	return { rows, loose: activeAssets().filter((a) => !controllingOrgs(a.id).length) };
}

/* ── Liabilities ────────────────────────────────────────────────────── */

/**
 * Debt against an asset. `balance` is carried here for the prototype;
 * live, it falls out of start_amount, interest_rate, payment_amount and
 * months, which are the columns the table actually has.
 *
 * @typedef {{
 *   name: string, type: string, lender: string|null, asset: string|null,
 *   borrower: string, startAmount: number, balance: number, rate: number,
 *   payment: number, frequency: 'Monthly'|'Quarterly'|'Yearly', months: number,
 *   started: string, dueDay: number, notes: string
 * }} Liability
 */

export const LOAN_TYPES = ['Loan Note', 'Lease', 'Contract', 'Contingent', 'Other'];

/** @type {Record<string, Liability>} */
const RAW_LIABILITIES = {
	'house-note': {
		name: 'House note',
		type: 'Loan Note',
		lender: 'bank',
		asset: 'family-home',
		borrower: 'tn',
		startAmount: 360000,
		balance: 312400,
		rate: 6.25,
		payment: 2216,
		frequency: 'Monthly',
		months: 360,
		started: 'June 2021',
		dueDay: 1,
		notes: ''
	},
	'business-loan': {
		name: 'Business loan',
		type: 'Loan Note',
		lender: 'bank',
		asset: 'delivery-van',
		borrower: 'azbolt',
		startAmount: 32000,
		balance: 22300,
		rate: 7.9,
		payment: 640,
		frequency: 'Monthly',
		months: 60,
		started: 'February 2025',
		dueDay: 20,
		notes: ''
	},
	'equipment-lease': {
		name: 'Equipment lease',
		type: 'Lease',
		lender: null,
		asset: 'storage-racking',
		borrower: 'azbolt',
		startAmount: 17400,
		balance: 9800,
		rate: 0,
		payment: 1450,
		frequency: 'Quarterly',
		months: 36,
		started: 'February',
		dueDay: 15,
		notes: ''
	}
};

/**
 * The same loans with every figure in cents. The rate is a percentage
 * and the term a count of months, so neither is converted.
 * @type {Record<string, Liability>}
 */
export const LIABILITIES = Object.fromEntries(
	Object.entries(RAW_LIABILITIES).map(([id, l]) => [
		id,
		{
			...l,
			startAmount: dollars(l.startAmount),
			balance: dollars(l.balance),
			payment: dollars(l.payment)
		}
	])
);

/** @typedef {Liability & { id: string }} LiabilityRow */

export const liabilities = () =>
	Object.entries(LIABILITIES).map(([id, l]) => /** @type {LiabilityRow} */ ({ id, ...l }));

export const owedTotal = () => liabilities().reduce((n, l) => n + l.balance, 0);

/** What goes out each month across every liability, quarterlies spread. */
export const owedMonthly = () =>
	liabilities().reduce(
		(n, l) =>
			n +
			(l.frequency === 'Quarterly'
				? Math.round(l.payment / 3)
				: l.frequency === 'Yearly'
					? Math.round(l.payment / 12)
					: l.payment),
		0
	);

/** @param {string} assetId */
export const owedAgainst = (assetId) => liabilities().filter((l) => l.asset === assetId);

/**
 * @param {Liability} l
 * @param {Date} [now]
 */
export function nextDue(l, now = new Date()) {
	const today = startOfDay(now);
	const step = l.frequency === 'Quarterly' ? 3 : l.frequency === 'Yearly' ? 12 : 1;
	/* Decision 15: the cadence counts from the agreement's own start, so
	   a quarterly lease that began in February falls due in February,
	   May, August and November — not in March because the calendar
	   quarter says so. */
	const start = startMonth(l, today);
	let n = Math.max(0, Math.ceil(monthsBetween(start, today) / step));
	let d = onDay(start, n * step, l.dueDay);
	while (d < today) d = onDay(start, ++n * step, l.dueDay);
	return d;
}

/**
 * The month an agreement started, read from its written start. An
 * agreement with no readable start is treated as starting this month,
 * which keeps the cadence steady rather than guessing a history.
 * @param {{ started?: string }} l
 * @param {Date} today
 */
function startMonth(l, today) {
	const text = String(l.started ?? '').trim();
	const m = MONTHS_LONG.findIndex((name) => text.toLowerCase().startsWith(name.toLowerCase()));
	if (m < 0) return new Date(today.getFullYear(), today.getMonth(), 1);
	const year = Number(text.match(/\d{4}/)?.[0] ?? today.getFullYear());
	return new Date(year, m, 1);
}

/** @param {Date} a @param {Date} b */
const monthsBetween = (a, b) =>
	(b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());

/**
 * The nth period after a start, on a given day of the month, with the
 * day clamped to the end of a short one: a payment due on the 31st
 * falls on 28 February, not on 3 March.
 * @param {Date} start @param {number} months @param {number} day
 */
function onDay(start, months, day) {
	const y = start.getFullYear();
	const m = start.getMonth() + months;
	const last = new Date(y, m + 1, 0).getDate();
	return new Date(y, m, Math.min(day, last));
}

/** The liability whose next payment comes first. */
export function upcomingPayment(now = new Date()) {
	return liabilities()
		.map((l) => ({ l, due: nextDue(l, now) }))
		.sort((a, b) => a.due.getTime() - b.due.getTime())[0];
}

/**
 * What a liability record is still missing.
 * @param {Liability} l
 */
export function liabilityGaps(l) {
	/** @type {string[]} */
	const why = [];
	if (!l.lender) why.push('Lender not linked');
	if (!l.asset) why.push('Not tied to an asset');
	return why;
}

/** @param {Liability} l */
export function termsLine(l) {
	const rate = l.rate ? `${l.rate}%` : 'no interest';
	return `${money(l.payment)} ${l.frequency.toLowerCase()} · ${rate} · ${l.months} months`;
}

/* ── The three numbers ──────────────────────────────────────────────── */

/* ── What things are worth, per organization ────────────────────────── */

/**
 * The book a figure is worked out from. Every function below takes one,
 * defaulting to the sample records, so the same arithmetic can run over
 * live records, over a test's handful of rows, and over a scenario's
 * own book without being written three times.
 * @typedef {{
 *   assets: Record<string, Asset>,
 *   links: Link[],
 *   liabilities: Record<string, Liability>,
 *   orgs: Record<string, any>
 * }} Book
 */

/** @type {Book} */
export const sample = { assets: ASSETS, links: LINKS, liabilities: LIABILITIES, orgs: ORGS };

/** Everything on file, whoever holds it. Not a net worth: see netWorthOf. */
export const assetValue = (book = sample) =>
	sumValue(
		Object.entries(book.assets)
			.filter(([, a]) => !a.letGo)
			.map(([id, a]) => ({ ...a, id })),
		book.assets
	);

/**
 * What one organization is worth.
 *
 * Decision 2: each organization has its own figure, counted from the
 * shares it owns. Only an Owner link counts — managing a thing or
 * guaranteeing a loan is not holding value — and a share counts for
 * its share, so half a house is half a house.
 *
 * An organization that owns another counts its share of that one's net
 * worth rather than its assets, so nothing is counted twice however
 * deep the chain runs. A loop in the chain stops rather than spinning.
 *
 * @param {string} orgId
 * @param {Book} [book]
 * @param {Set<string>} [open]  organizations already being worked out
 * @returns {number} cents
 */
export function netWorthOf(orgId, book = sample, open = new Set()) {
	if (open.has(orgId)) return 0;
	open.add(orgId);
	let total = 0;
	for (const l of book.links) {
		if (l.role !== 'Owner' || l.owner.cls !== 'organization' || l.owner.id !== orgId) continue;
		if (l.owned.cls === 'asset') {
			const a = book.assets[l.owned.id];
			/* An asset inside another is counted through its parent. */
			if (!a || a.letGo || (a.parent && book.assets[a.parent])) continue;
			const v = effectiveValue({ ...a, id: l.owned.id }, book.assets);
			if (v === null || l.units === null) continue;
			total += Math.round(v * (l.units / (a.units ?? SHARE_UNITS)));
		} else {
			const share = l.units === null ? 1 : l.units / SHARE_UNITS;
			total += Math.round(netWorthOf(l.owned.id, book, open) * share);
		}
	}
	for (const l of Object.values(book.liabilities)) {
		if (l.borrower === orgId) total -= l.balance;
	}
	open.delete(orgId);
	return total;
}

/**
 * Organizations nobody owns. These are the tops of the chains, so
 * adding their figures counts everything owned, once.
 * @param {Book} [book]
 */
export function rootOrgs(book = sample) {
	const owned = new Set(
		book.links
			.filter((l) => l.role === 'Owner' && l.owned.cls === 'organization')
			.map((l) => l.owned.id)
	);
	return Object.keys(book.orgs).filter((id) => !owned.has(id));
}

/**
 * The headline figure: every organization on file, net of what each
 * owes, counted once.
 *
 * It used to add every asset at full value whoever held it, so a
 * leased thing counted as yours and a half share as a whole one. Only
 * the tops of the chains are added now, and each counts its share, so
 * nothing below them is counted twice.
 *
 * It is not yet "your" net worth, and the hub says so. Decision 2 puts
 * a figure on each organization and decision 3 says yours is your own
 * organization's — and that organization is not a record until the
 * Directory can save one.
 * @param {Book} [book]
 */
export const netWorth = (book = sample) =>
	rootOrgs(book).reduce((n, id) => n + netWorthOf(id, book), 0);

/**
 * How many assets on file are not held by any organization at all, and
 * so appear in no organization's figure.
 * @param {Book} [book]
 */
export function unheldAssets(book = sample) {
	return Object.entries(book.assets)
		.filter(([id, a]) => !a.letGo && !a.parent && !controllingOrgs(id, book.links).length)
		.map(([id, a]) => ({ ...a, id }));
}

/**
 * Net worth by the organization that ends up holding each asset. An
 * asset with no organization is counted under null, so the parts still
 * add up to the whole.
 */
export function worthByOrganization(book = sample) {
	/** @type {{ org: string|null, assets: number, value: number, held: number, owed: number, net: number }[]} */
	const rows = [];
	for (const org of Object.keys(book.orgs)) {
		let assets = 0;
		let value = 0;
		let held = 0;
		for (const l of book.links) {
			if (l.role !== 'Owner' || l.owner.cls !== 'organization' || l.owner.id !== org) continue;
			if (l.owned.cls === 'asset') {
				const a = book.assets[l.owned.id];
				if (!a || a.letGo || (a.parent && book.assets[a.parent])) continue;
				const v = effectiveValue({ ...a, id: l.owned.id }, book.assets);
				assets += 1;
				if (v !== null && l.units !== null) {
					value += Math.round(v * (l.units / (a.units ?? SHARE_UNITS)));
				}
			} else {
				const share = l.units === null ? 1 : l.units / SHARE_UNITS;
				held += Math.round(netWorthOf(l.owned.id, book) * share);
			}
		}
		const owed = Object.values(book.liabilities)
			.filter((l) => l.borrower === org)
			.reduce((n, l) => n + l.balance, 0);
		if (!assets && !held && !owed) continue;
		rows.push({ org, assets, value, held, owed, net: value + held - owed });
	}
	/* Anything no organization owns is its own row, so it is visible
	   rather than quietly dropped out of the total. */
	const loose = unheldAssets(book);
	if (loose.length) {
		const { known } = valueSummary(loose, book.assets);
		rows.push({ org: null, assets: loose.length, value: known, held: 0, owed: 0, net: known });
	}
	return rows.sort((a, b) => b.net - a.net);
}

/* ── Cash ───────────────────────────────────────────────────────────── */

/** The seven cash types. The first three are money coming in. */
export const CASH_TYPES = [
	'Cash In',
	'Cash Receivable',
	'Cash Projected',
	'Actual Expense',
	'Accrued Expense',
	'Projected Expense',
	'Payable'
];
const INWARD = ['Cash In', 'Cash Receivable', 'Cash Projected'];

/** Only these two have actually moved. Everything else is expected. */
const COUNTED = ['Cash In', 'Actual Expense'];

export const EXPENSE_CATEGORIES = [
	'COGS',
	'Marketing, advertising',
	'Wages, commissions, benefits',
	'Equipment, machinery',
	'Mortgages, leases',
	'Travel',
	'Office',
	'Taxes, licenses, fees',
	'Insurances',
	'Utilities',
	'R&D',
	'Other cash out'
];

export const FREQUENCIES = ['Once', 'Monthly', 'Quarterly', 'Yearly'];

/** @param {string} type */
export const direction = (type) => (INWARD.includes(type) ? 'in' : 'out');

/**
 * @typedef {{
 *   id: string, label: string, org: string, type: string, category: string,
 *   amount: number, frequency: string, date: Date
 * }} Tx
 */

/** Lines that repeat. `day` is the day of the month they land on. */
const RAW_RECURRING = [
	{
		label: 'Build Suite subscriptions',
		org: 'azbolt',
		inward: true,
		category: 'Services',
		amount: 9800,
		day: 3
	},
	{ label: 'Book sales', org: 'tn', inward: true, category: 'Product', amount: 1180, day: 8 },
	{
		label: 'Wages',
		org: 'azbolt',
		inward: false,
		category: 'Wages, commissions, benefits',
		amount: 4800,
		day: 5
	},
	{
		label: 'Software services',
		org: 'azbolt',
		inward: false,
		category: 'Office',
		amount: 1240,
		day: 10
	},
	{
		label: 'House note',
		org: 'tn',
		inward: false,
		category: 'Mortgages, leases',
		amount: 2216,
		day: 1
	},
	{
		label: 'Business loan',
		org: 'azbolt',
		inward: false,
		category: 'Mortgages, leases',
		amount: 640,
		day: 20
	},
	{ label: 'Insurance', org: 'tn', inward: false, category: 'Insurances', amount: 310, day: 12 },
	{ label: 'Utilities', org: 'tn', inward: false, category: 'Utilities', amount: 268, day: 18 }
];

/** One-offs, as an age in days (negative is still to come). */
const RAW_ONE_OFF = [
	{
		label: 'Consulting — Fifita Rugby Club',
		org: 'azbolt',
		type: 'Cash Receivable',
		category: 'Consulting',
		amount: 2500,
		age: 9
	},
	{
		label: 'Van brakes',
		org: 'azbolt',
		type: 'Actual Expense',
		category: 'Equipment, machinery',
		amount: 780,
		age: 75
	},
	{
		label: 'Roof inspection',
		org: 'tn',
		type: 'Actual Expense',
		category: 'Other cash out',
		amount: 420,
		age: 150
	},
	{
		label: 'Printer sold',
		org: 'azbolt',
		type: 'Cash In',
		category: 'Other',
		amount: 150,
		age: 20
	},
	{
		label: 'Year-end licenses',
		org: 'azbolt',
		type: 'Accrued Expense',
		category: 'Taxes, licenses, fees',
		amount: 900,
		age: 4
	}
];
/* Both cash fixtures, in cents. */
const RECURRING = RAW_RECURRING.map((r) => ({ ...r, amount: dollars(r.amount) }));
const ONE_OFF = RAW_ONE_OFF.map((o) => ({ ...o, amount: dollars(o.amount) }));

/**
 * Every entry for the twelve months up to now, plus what is expected in
 * the next five weeks. A repeating line that has not landed yet this
 * month is the same line with an expected type — Payable or Cash
 * Projected — which is exactly the distinction the seven types exist to
 * draw.
 *
 * @param {Date} [now]
 * @returns {Tx[]}
 */
export function transactions(now = new Date()) {
	const today = startOfDay(now);
	const horizon = new Date(today.getTime() + 35 * DAY);
	/** @type {Tx[]} */
	const out = [];
	for (const r of RECURRING) {
		for (let back = 12; back >= -1; back--) {
			const date = new Date(today.getFullYear(), today.getMonth() - back, r.day);
			if (date > horizon) continue;
			const landed = date <= today;
			out.push({
				id: `${slug(r.label)}-${date.getFullYear()}-${date.getMonth() + 1}`,
				label: r.label,
				org: r.org,
				type: r.inward
					? landed
						? 'Cash In'
						: 'Cash Projected'
					: landed
						? 'Actual Expense'
						: 'Payable',
				category: r.category,
				amount: r.amount,
				frequency: 'Monthly',
				date
			});
		}
	}
	// The equipment lease, quarterly.
	const lease = LIABILITIES['equipment-lease'];
	for (let q = -4; q <= 1; q++) {
		const m = Math.floor(today.getMonth() / 3) * 3 + 2 + q * 3;
		const date = new Date(today.getFullYear(), m, lease.dueDay);
		if (date > horizon || date < new Date(today.getTime() - 366 * DAY)) continue;
		out.push({
			id: `equipment-lease-${date.getFullYear()}-${date.getMonth() + 1}`,
			label: 'Equipment lease',
			org: lease.borrower,
			type: date <= today ? 'Actual Expense' : 'Projected Expense',
			category: 'Mortgages, leases',
			amount: lease.payment,
			frequency: 'Quarterly',
			date
		});
	}
	for (const o of ONE_OFF) {
		out.push({
			id: slug(o.label),
			label: o.label,
			org: o.org,
			type: o.type,
			category: o.category,
			amount: o.amount,
			frequency: 'Once',
			date: daysAgo(o.age, now)
		});
	}
	return out.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** @typedef {'month'|'quarter'|'year'} Period */

/**
 * @param {Period} period
 * @param {Date} [now]
 * @returns {[Date, Date]} start inclusive, end exclusive
 */
function bounds(period, now = new Date()) {
	const y = now.getFullYear();
	const m = now.getMonth();
	if (period === 'year') return [new Date(y, 0, 1), new Date(y + 1, 0, 1)];
	if (period === 'quarter') {
		const q = Math.floor(m / 3) * 3;
		return [new Date(y, q, 1), new Date(y, q + 3, 1)];
	}
	return [new Date(y, m, 1), new Date(y, m + 1, 1)];
}

/**
 * @param {Period} period
 * @param {Date} [now]
 */
export function cashFor(period, now = new Date()) {
	const [from, to] = bounds(period, now);
	return transactions(now).filter((t) => t.date >= from && t.date < to);
}

/**
 * Cash in, cash out and the difference, over entries that have actually
 * moved. Not profit — a number that is useful to know.
 * @param {Tx[]} list
 */
export function cashTotals(list) {
	const inn = list.filter((t) => t.type === 'Cash In').reduce((n, t) => n + t.amount, 0);
	const out = list.filter((t) => t.type === 'Actual Expense').reduce((n, t) => n + t.amount, 0);
	return { in: inn, out, net: inn - out };
}

/** @param {Tx} t */
export const counted = (t) => COUNTED.includes(t.type);

/** @param {Tx} t */
export const txAmount = (t) =>
	`${direction(t.type) === 'in' ? '+' : '−'}$${Math.round(t.amount).toLocaleString('en-US')}`;

/**
 * The same entries, regrouped: by month or by cash type, each group
 * with its own subtotal.
 *
 * @param {Tx[]} list
 * @param {'period'|'type'} by
 */
export function groupCash(list, by) {
	/** @type {Map<string, Tx[]>} */
	const groups = new Map();
	for (const t of list) {
		const key =
			by === 'type' ? t.type : `${MONTHS_LONG[t.date.getMonth()]} ${t.date.getFullYear()}`;
		if (!groups.has(key)) groups.set(key, []);
		/** @type {Tx[]} */ (groups.get(key)).push(t);
	}
	const rows = [...groups.entries()].map(([heading, items]) => ({
		heading,
		items,
		subtotal: items.reduce((n, t) => n + (direction(t.type) === 'in' ? t.amount : -t.amount), 0)
	}));
	if (by === 'type')
		rows.sort((a, b) => CASH_TYPES.indexOf(a.heading) - CASH_TYPES.indexOf(b.heading));
	return rows;
}

/**
 * One row per line, summed over the period — the Overview.
 * @param {Tx[]} list
 */
export function cashLines(list) {
	/** @type {Map<string, { label: string, dir: string, frequency: string, total: number }>} */
	const lines = new Map();
	for (const t of list.filter(counted)) {
		/* Keyed by direction as well as label. Keyed by label alone, an
		   expense called "Adjustment" was added into income of the same
		   name and the expense row vanished. */
		const dir = direction(t.type);
		const key = `${dir}:${t.label}`;
		const cur = lines.get(key) ?? { label: t.label, dir, frequency: t.frequency, total: 0 };
		cur.total += t.amount;
		lines.set(key, cur);
	}
	const all = [...lines.values()].sort((a, b) => b.total - a.total);
	return { in: all.filter((l) => l.dir === 'in'), out: all.filter((l) => l.dir === 'out') };
}

/**
 * How long the liquid assets last at the current rate of spending: what
 * is liquid, over average monthly cash out across the last three whole
 * months.
 * @param {Date} [now]
 */
/**
 * How long the liquid money lasts at the recent rate of spending.
 * @param {Date} [now]
 * @param {string|null} [org]  one organization, or every one together
 * @param {Book} [book]
 */
export function runway(now = new Date(), org = null, book = sample) {
	/* Decision 14: an organization's runway is its own. A business
	   should not look safe because the household has savings, and a
	   household is simply another organization, like a joint account. */
	const mine = Object.entries(book.assets)
		.filter(([id, a]) => {
			if (a.letGo || a.liquidity !== 'Liquid') return false;
			if (!org) return true;
			return book.links.some(
				(l) =>
					l.role === 'Owner' &&
					l.owner.cls === 'organization' &&
					l.owner.id === org &&
					l.owned.cls === 'asset' &&
					l.owned.id === id
			);
		})
		.map(([id, a]) => ({ ...a, id }));
	const liquid = sumValue(mine, book.assets);
	const from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
	const to = new Date(now.getFullYear(), now.getMonth(), 1);
	const out = transactions(now)
		.filter((t) => t.type === 'Actual Expense' && t.date >= from && t.date < to)
		.filter((t) => !org || t.org === org)
		.reduce((n, t) => n + t.amount, 0);
	const monthly = out / 3;
	return { liquid, monthly, months: monthly ? liquid / monthly : null };
}

/* ── Activity ───────────────────────────────────────────────────────── */

/** The six things that happen to an asset. */
export const EVENT_TYPES = ['Acquired', 'Moved', 'Transferred', 'Re-valued', 'Upkeep', 'Let go'];

/** @type {{ asset: string, type: string, detail: string, age: number }[]} */
const EVENTS = [
	{ asset: 'family-home', type: 'Acquired', detail: 'Purchased · deed recorded', age: 1990 },
	{ asset: 'family-home', type: 'Upkeep', detail: 'Roof inspected', age: 150 },
	{ asset: 'family-home', type: 'Re-valued', detail: 'Assessor notice added', age: 120 },
	{ asset: 'family-car', type: 'Acquired', detail: 'Bought used · title on file', age: 900 },
	{ asset: 'family-car', type: 'Re-valued', detail: 'Marked down to market', age: 60 },
	{ asset: 'family-car', type: 'Upkeep', detail: 'Service and tires', age: 45 },
	{
		asset: 'delivery-van',
		type: 'Acquired',
		detail: 'Financed through the business loan',
		age: 650
	},
	{ asset: 'delivery-van', type: 'Re-valued', detail: 'Marked down to market', age: 200 },
	{ asset: 'delivery-van', type: 'Upkeep', detail: 'Brakes replaced', age: 75 },
	{ asset: 'storage-racking', type: 'Acquired', detail: 'Lease signed', age: 280 },
	{ asset: 'storage-racking', type: 'Moved', detail: 'Installed at the storage site', age: 250 },
	{ asset: 'build-suite-code', type: 'Transferred', detail: 'Assigned to Azbolt', age: 520 },
	{ asset: 'build-suite-code', type: 'Re-valued', detail: 'Review document added', age: 90 },
	{ asset: 'carmen-contract', type: 'Acquired', detail: 'Agreement signed', age: 310 },
	{
		asset: 'nfta-014',
		type: 'Acquired',
		detail: 'Artist identity captured · token linked',
		age: 310
	},
	{ asset: 'nfta-014', type: 'Re-valued', detail: 'Review document added', age: 102 },
	{ asset: 'nfta-014', type: 'Upkeep', detail: 'Storage checked · facility confirmation', age: 93 },
	{ asset: 'nfta-022', type: 'Acquired', detail: 'Added to the Studio collection', age: 280 },
	{ asset: 'nfta-022', type: 'Moved', detail: 'Movement requested · not yet approved', age: 103 },
	{ asset: 'studio-collection', type: 'Acquired', detail: 'Four works brought together', age: 430 },
	{ asset: 'studio-collection', type: 'Re-valued', detail: 'Last valuation', age: 425 },
	{
		asset: 'household-savings',
		type: 'Re-valued',
		detail: 'Balance updated from statement',
		age: 12
	},
	{
		asset: 'azbolt-operating',
		type: 'Re-valued',
		detail: 'Balance updated from statement',
		age: 2
	},
	{ asset: 'office-printer', type: 'Acquired', detail: 'Bought new', age: 1100 },
	{
		asset: 'office-printer',
		type: 'Let go',
		detail: 'Sold · proceeds recorded as cash in',
		age: 20
	}
];

/**
 * @typedef {{ asset: string, name: string, type: string, detail: string, date: Date, when: string }} AssetEvent
 */

/**
 * Asset events, newest first — for one asset or across all of them.
 * @param {string|null} [assetId]
 * @param {Date} [now]
 * @returns {AssetEvent[]}
 */
export function events(assetId = null, now = new Date()) {
	return EVENTS.filter((e) => !assetId || e.asset === assetId)
		.sort((a, b) => a.age - b.age)
		.map((e) => {
			const date = daysAgo(e.age, now);
			return {
				asset: e.asset,
				name: ASSETS[e.asset]?.name ?? e.asset,
				type: e.type,
				detail: e.detail,
				date,
				when: dayLabel(date, now)
			};
		});
}

/**
 * When an asset's value was last looked at, in words.
 * @param {Asset} a
 * @param {Date} [now]
 */
export function valuedLine(a, now = new Date()) {
	if (a.value === null) return 'No value recorded';
	if (a.valuedDaysAgo === null) return money(a.value);
	return `${money(a.value)} · reviewed ${inSentence(dayLabel(daysAgo(a.valuedDaysAgo, now), now))}`;
}
