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

/** @param {number|null|undefined} n */
export function money(n) {
	if (n === null || n === undefined) return '—';
	const sign = n < 0 ? '−' : '';
	return `${sign}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;
}

/**
 * For the three-up stat strip, where a seven-figure sum does not fit.
 * @param {number|null|undefined} n
 */
export function short(n) {
	if (n === null || n === undefined) return '—';
	const a = Math.abs(n);
	const sign = n < 0 ? '−' : '';
	if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2).replace(/\.?0+$/, '')}M`;
	if (a >= 1e4) return `${sign}$${Math.round(a / 1e3)}K`;
	return `${sign}$${Math.round(a).toLocaleString('en-US')}`;
}

/** @param {number} n */
export const signed = (n) =>
	`${n < 0 ? '−' : '+'}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;

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
 *   movement?: string, letGo?: boolean
 * }} Asset
 */

/** Claims that speak to who holds the thing, as opposed to where it is. */
const OWNERSHIP_CLAIMS = ['Ownership token', 'Title / provenance', 'Agreement', 'Statement'];

/** @type {Record<string, Asset>} */
export const ASSETS = {
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

/** @typedef {Asset & { id: string }} AssetRow */

/** Assets still held. One that has been let go keeps its record and its history. */
export function activeAssets() {
	return Object.entries(ASSETS)
		.filter(([, a]) => !a.letGo)
		.map(([id, a]) => /** @type {AssetRow} */ ({ id, ...a }));
}

/** @param {string} id */
export const assetOf = (id) => ASSETS[id] ?? null;

/** @param {{ value: number|null }[]} list */
export const sumValue = (list) => list.reduce((n, a) => n + (a.value ?? 0), 0);

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
 *   shares: number|null, startValue: number|null, currentValue: number|null,
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
		shares: 100,
		startValue: 50000,
		currentValue: 420000,
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
 * @type {{ owner: Node, owned: string, role: OwnerType, shares: number|null, startValue: number|null, since: string, claims: number }[]}
 */
const ASSET_LINKS = [
	{
		owner: { cls: 'organization', id: 'tn' },
		owned: 'family-home',
		role: 'Owner',
		shares: 100,
		startValue: 410000,
		since: 'June 2021',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'tn' },
		owned: 'family-car',
		role: 'Owner',
		shares: 100,
		startValue: 31000,
		since: 'May 2024',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'tn' },
		owned: 'household-savings',
		role: 'Owner',
		shares: 100,
		startValue: 5000,
		since: 'January 2022',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'delivery-van',
		role: 'Owner',
		shares: 100,
		startValue: 38000,
		since: 'February 2025',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'storage-racking',
		role: 'Manager',
		shares: null,
		startValue: null,
		since: 'February',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'azbolt-operating',
		role: 'Owner',
		shares: 100,
		startValue: 10000,
		since: 'January 2021',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'build-suite-code',
		role: 'Owner',
		shares: 100,
		startValue: 20000,
		since: 'June 2025',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'azbolt' },
		owned: 'carmen-contract',
		role: 'Owner',
		shares: 100,
		startValue: null,
		since: 'January',
		claims: 1
	},
	{
		owner: { cls: 'organization', id: 'ame' },
		owned: 'nfta-014',
		role: 'Owner',
		shares: 100,
		startValue: 36000,
		since: 'January',
		claims: 2
	},
	{
		owner: { cls: 'organization', id: 'ame' },
		owned: 'studio-collection',
		role: 'Owner',
		shares: 100,
		startValue: 58000,
		since: 'September 2025',
		claims: 1
	},
	// An asset owning an asset. The chain still ends at AME.
	{
		owner: { cls: 'asset', id: 'studio-collection' },
		owned: 'nfta-022',
		role: 'Owner',
		shares: 100,
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
			shares: d.shares ?? null,
			startValue: d.startValue ?? null,
			currentValue: d.currentValue ?? null,
			disposable: null,
			since: d.since ?? '',
			claims: d.claims ?? 0
		});
	}
	for (const l of ASSET_LINKS) {
		const a = ASSETS[l.owned];
		const share = l.shares === null ? null : l.shares / 100;
		out.push({
			id: `${l.owner.id}-${l.owned}`,
			owner: l.owner,
			owned: { cls: 'asset', id: l.owned },
			role: l.role,
			shares: l.shares,
			startValue: l.startValue,
			// A manager holds no share of the value; an owner holds theirs.
			currentValue: share === null || a?.value == null ? null : a.value * share,
			disposable: a?.liquidity === 'Liquid' && share !== null ? (a.value ?? 0) * share : null,
			since: l.since,
			claims: l.claims
		});
	}
	return out;
}

/** @type {Link[]} */
export const LINKS = buildLinks();

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
export const ownersOf = (n) => LINKS.filter((l) => l.owned.cls === n.cls && l.owned.id === n.id);

/** @param {Node} n */
export const ownedBy = (n) => LINKS.filter((l) => l.owner.cls === n.cls && l.owner.id === n.id);

/**
 * Follows an asset's owners upward until organizations are reached.
 * Empty means the chain never gets to one — which is the thing the
 * lexicon says may not be left standing.
 *
 * @param {string} assetId
 * @param {Set<string>} [seen]
 * @returns {string[]} organization ids
 */
export function controllingOrgs(assetId, seen = new Set()) {
	if (seen.has(assetId)) return [];
	seen.add(assetId);
	/** @type {string[]} */
	const out = [];
	for (const l of ownersOf({ cls: 'asset', id: assetId })) {
		if (l.owner.cls === 'organization') out.push(l.owner.id);
		else out.push(...controllingOrgs(l.owner.id, seen));
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
export function attention(assetId) {
	const a = ASSETS[assetId];
	if (!a || a.letGo) return [];
	/** @type {string[]} */
	const why = [];
	if (!controllingOrgs(assetId).length)
		why.push('No owner — it has to end up with an organization');
	if (a.value === null) why.push('No value recorded');
	else if (a.valuedDaysAgo !== null && a.valuedDaysAgo > 365) {
		why.push(`Valuation ${Math.round(a.valuedDaysAgo / 30.4)} months old`);
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
 *   payment: number, frequency: 'Monthly'|'Quarterly', months: number,
 *   started: string, dueDay: number, notes: string
 * }} Liability
 */

export const LOAN_TYPES = ['Loan Note', 'Lease', 'Contract', 'Contingent', 'Other'];

/** @type {Record<string, Liability>} */
export const LIABILITIES = {
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

/** @typedef {Liability & { id: string }} LiabilityRow */

export const liabilities = () =>
	Object.entries(LIABILITIES).map(([id, l]) => /** @type {LiabilityRow} */ ({ id, ...l }));

export const owedTotal = () => liabilities().reduce((n, l) => n + l.balance, 0);

/** What goes out each month across every liability, quarterlies spread. */
export const owedMonthly = () =>
	liabilities().reduce((n, l) => n + (l.frequency === 'Quarterly' ? l.payment / 3 : l.payment), 0);

/** @param {string} assetId */
export const owedAgainst = (assetId) => liabilities().filter((l) => l.asset === assetId);

/**
 * @param {Liability} l
 * @param {Date} [now]
 */
export function nextDue(l, now = new Date()) {
	const today = startOfDay(now);
	// Quarterlies fall in March, June, September and December.
	const step = l.frequency === 'Quarterly' ? 3 : 1;
	let m = today.getMonth();
	if (step === 3) m = Math.floor(m / 3) * 3 + 2;
	let d = new Date(today.getFullYear(), m, l.dueDay);
	if (d < today) d = new Date(today.getFullYear(), m + step, l.dueDay);
	return d;
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

export const assetValue = () => sumValue(activeAssets());
export const netWorth = () => assetValue() - owedTotal();

/**
 * Net worth by the organization that ends up holding each asset. An
 * asset with no organization is counted under null, so the parts still
 * add up to the whole.
 */
export function worthByOrganization() {
	/** @type {Map<string|null, { assets: number, value: number, owed: number }>} */
	const by = new Map();
	/** @param {string|null} k */
	const slot = (k) => {
		if (!by.has(k)) by.set(k, { assets: 0, value: 0, owed: 0 });
		return /** @type {{ assets: number, value: number, owed: number }} */ (by.get(k));
	};
	for (const a of activeAssets()) {
		const s = slot(controllingOrgs(a.id)[0] ?? null);
		s.assets += 1;
		s.value += a.value ?? 0;
	}
	for (const l of liabilities()) slot(l.borrower).owed += l.balance;
	return [...by.entries()]
		.map(([org, v]) => ({ org, ...v, net: v.value - v.owed }))
		.sort((a, b) => b.net - a.net);
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
const RECURRING = [
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
const ONE_OFF = [
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
		const cur = lines.get(t.label) ?? {
			label: t.label,
			dir: direction(t.type),
			frequency: t.frequency,
			total: 0
		};
		cur.total += t.amount;
		lines.set(t.label, cur);
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
export function runway(now = new Date()) {
	const liquid = sumValue(activeAssets().filter((a) => a.liquidity === 'Liquid'));
	const from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
	const to = new Date(now.getFullYear(), now.getMonth(), 1);
	const out = transactions(now)
		.filter((t) => t.type === 'Actual Expense' && t.date >= from && t.date < to)
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
