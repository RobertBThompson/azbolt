import { createPocketBase, pocketBaseReachable } from '@azbolt/lib/pocketbase';
import { sampleWork } from './work.js';
import { PEOPLE, ORGS } from './data.js';

/**
 * Chief's data layer.
 *
 * PocketBase is proxied under Chief's own origin at /api, so the client
 * needs no base URL and no CORS config.
 *
 * Every read reports where its rows came from, because showing design
 * placeholders as though they were the user's own records is the one
 * failure this layer must not have. There are three answers:
 *
 *   'live'    real records for the signed-in user
 *   'anon'    a backend is up but nobody is signed in, so the
 *             owner-scoped rules return nothing and fixtures stand in
 *   'fixture' no backend at all — the prototype's normal state
 *   'error'   signed in, and the read failed
 *
 * 'anon' is kept distinct from 'fixture' because they need different
 * words on screen: one is an invitation to sign in, the other is not.
 *
 * 'error' returns nothing rather than fixtures. A signed-in account
 * shown design placeholders after a failed read cannot tell them from
 * its own records, and a note at the foot of the screen is not enough
 * when the rows above it look like data. The screen says the read
 * failed and offers to try again.
 */
export const pb = createPocketBase('', 'azbolt.chief.pb');

/* The SDK cancels a request when an identical one starts before it
   finishes, and the cancelled one fails. Two screens asking for the
   same list at once is ordinary here — a layout and the page under it
   — and one of them must not be told the server is down. */
pb.autoCancellation(false);

/** @typedef {'live'|'anon'|'fixture'|'error'} Source */

/** @type {boolean|null} */
let reachable = null;

/** Checked once per page load; the answer does not change mid-session. */
export async function backendUp() {
	if (reachable === null) reachable = await pocketBaseReachable(pb);
	return reachable;
}

/**
 * @template T
 * @param {() => Promise<T>} live
 * @param {() => T} fixture
 * @param {T} empty  what a failed read shows: nothing of this kind
 * @returns {Promise<{ data: T, source: Source, error?: string }>}
 */
async function readOr(live, fixture, empty) {
	if (!(await backendUp())) return { data: fixture(), source: 'fixture' };
	if (!pb.authStore.isValid) return { data: fixture(), source: 'anon' };
	try {
		return { data: await live(), source: 'live' };
	} catch (/** @type {any} */ err) {
		return {
			data: empty,
			source: 'error',
			error: err?.message || 'The server did not answer.'
		};
	}
}

/**
 * Retire a record without destroying it. Old records still name it, so
 * a hard delete would leave them pointing at nothing.
 * @param {string} collection
 * @param {string} id
 */
export function archive(collection, id) {
	return pb.collection(collection).update(id, { archived: new Date().toISOString() });
}

/** The id every write hangs its `owner` relation on. */
function ownerId() {
	const id = pb.authStore.record?.id;
	if (!id) throw new Error('Not signed in.');
	return id;
}

/** @param {Record<string, any>} p */
const fullName = (p) => [p.first_name, p.last_name].filter(Boolean).join(' ');

/* ── Directory ──────────────────────────────────────────────────────── */

/**
 * @typedef {{ id: string, first_name: string, last_name: string, name: string,
 *             role: string, relationship: string, email: string, phone: string,
 *             notes: string, spheres: string[] }} PersonRow
 */

/** @param {Record<string, any>} r @returns {PersonRow} */
function person(r) {
	return {
		id: r.id,
		first_name: r.first_name ?? '',
		last_name: r.last_name ?? '',
		name: fullName(r),
		role: r.role ?? '',
		relationship: r.relationship ?? '',
		email: r.email ?? '',
		phone: r.phone ?? '',
		notes: r.notes ?? '',
		spheres: Array.isArray(r.spheres) ? r.spheres : []
	};
}

/** F1 Directory — D1. */
export function listPeople() {
	return readOr(
		async () => {
			const rows = await pb
				.collection('people')
				.getFullList({ sort: 'first_name', filter: 'archived = null' });
			return rows.map((r) => ({
				id: r.id,
				name: fullName(r),
				meta: [r.role, r.relationship].filter(Boolean).join(' · '),
				spheres: Array.isArray(r.spheres) ? r.spheres : []
			}));
		},
		() =>
			Object.entries(PEOPLE).map(([id, p]) => ({
				id,
				name: p.name,
				meta: `${p.role} · ${p.next}`,
				spheres: p.spheres
			})),
		[]
	);
}

/**
 * One person, or null when this account has no such record. A missing
 * record and a failed read are different answers, so only a 404 is
 * turned into null; anything else is thrown for the screen to report.
 * @param {string} id
 * @returns {Promise<PersonRow|null>}
 */
export async function getPerson(id) {
	if (!(await signedInLive())) return null;
	return orNull(async () => person(await pb.collection('people').getOne(id)));
}

/**
 * @param {{ first_name: string, last_name?: string, role?: string,
 *           relationship?: string, email?: string, phone?: string, notes?: string }} fields
 * @returns {Promise<PersonRow>}
 */
export async function createPerson(fields) {
	return person(await pb.collection('people').create({ ...fields, owner: ownerId() }));
}

/**
 * @param {string} id
 * @param {Partial<Omit<PersonRow, 'id'|'name'>>} fields
 * @returns {Promise<PersonRow>}
 */
export async function updatePerson(id, fields) {
	return person(await pb.collection('people').update(id, fields));
}

/**
 * @typedef {{ id: string, name: string, code: string, charter: string,
 *             blurb: string, spheres: string[], self: boolean }} OrgRow
 */

/** @param {Record<string, any>} r @returns {OrgRow} */
function organization(r) {
	return {
		id: r.id,
		name: r.name ?? '',
		code: r.code ?? '',
		charter: r.charter ?? '',
		blurb: r.blurb ?? '',
		spheres: Array.isArray(r.spheres) ? r.spheres : [],
		self: r.is_self === true
	};
}

/**
 * F1 Directory — D4 Organizations.
 *
 * An organization is a person or a grouping of people, and need not
 * include the Chief: "Wife" and "Chief and Wife" are both organizations.
 * It is not a sphere. A sphere is an area of a life — Family, Business,
 * Church — and lives in spheres.js, not here.
 *
 * The Chief's own organization leads the list. It is made here, the
 * first time the list is read, so an account never has to be told to
 * create itself.
 */
export function listOrganizations() {
	return readOr(
		async () => {
			await selfOrganization();
			const rows = await pb
				.collection('organizations')
				.getFullList({ sort: 'name', filter: 'archived = null' });
			const list = rows.map(organization);
			return [...list.filter((o) => o.self), ...list.filter((o) => !o.self)];
		},
		() =>
			Object.entries(ORGS).map(([id, o]) => ({
				id,
				name: o.name,
				code: o.code,
				charter: o.charter,
				blurb: o.blurb,
				spheres: o.spheres,
				self: false
			})),
		[]
	);
}

/**
 * @param {string} id
 * @returns {Promise<OrgRow|null>}
 */
export async function getOrganization(id) {
	if (!(await signedInLive())) return null;
	return orNull(async () => organization(await pb.collection('organizations').getOne(id)));
}

/**
 * `code` is one of the nine organization types, not a free label:
 * C, B, CO, CC, DO, DB, P, DN, CN.
 * @param {{ name: string, code: string, blurb?: string, charter?: string }} fields
 * @returns {Promise<OrgRow>}
 */
export async function createOrganization(fields) {
	return organization(await pb.collection('organizations').create({ ...fields, owner: ownerId() }));
}

/**
 * @param {string} id
 * @param {{ name?: string, code?: string, blurb?: string, charter?: string, spheres?: string[] }} fields
 * @returns {Promise<OrgRow>}
 */
export async function updateOrganization(id, fields) {
	return organization(await pb.collection('organizations').update(id, fields));
}

/**
 * The Chief's own organization: type C, one per account.
 *
 * No person owns anything, the Chief included. What the Chief holds is
 * held by this record, so every figure that says "yours" is a figure
 * about it. Made on first need rather than at sign-up, because an
 * account opened before this existed must end up with one too.
 * @returns {Promise<OrgRow>}
 */
export async function selfOrganization() {
	const mine = () =>
		pb.collection('organizations').getFirstListItem('is_self = true && archived = null');
	try {
		return organization(await mine());
	} catch (/** @type {any} */ err) {
		if (err?.status !== 404) throw err;
	}
	const user = pb.authStore.record;
	const name = user?.name || String(user?.email ?? '').split('@')[0] || 'Me';
	const make = (/** @type {string} */ n) =>
		pb.collection('organizations').create({ name: n, code: 'C', is_self: true, owner: ownerId() });
	try {
		return organization(await make(name));
	} catch {
		// Either another tab made it a moment ago, or an organization
		// already carries this name. Look again before trying a name
		// that cannot collide.
		try {
			return organization(await mine());
		} catch {
			return organization(await make(`${name} (me)`));
		}
	}
}

/** A live backend with somebody signed in: the only state with records to fetch. */
async function signedInLive() {
	return (await backendUp()) && pb.authStore.isValid;
}

/**
 * @template T
 * @param {() => Promise<T>} read
 * @returns {Promise<T|null>}
 */
async function orNull(read) {
	try {
		return await read();
	} catch (/** @type {any} */ err) {
		if (err?.status === 404) return null;
		throw err;
	}
}

/* ── Spheres ────────────────────────────────────────────────────────── */

/** @typedef {{ id: string, name: string, hue: string }} SphereRow */

/** A Chief's own spheres, in the order they were made. */
export function listSpheres() {
	return readOr(
		async () => {
			const rows = await pb
				.collection('spheres')
				.getFullList({ sort: 'created', filter: 'archived = null && retired = false' });
			return rows.map((r) => ({ id: r.id, name: r.name, hue: r.hue ?? '' }));
		},
		() => [],
		[]
	);
}

/**
 * @param {string} name
 * @param {string} [hue]
 * @returns {Promise<SphereRow>}
 */
export async function writeSphere(name, hue = '') {
	const row = await pb
		.collection('spheres')
		.create({ name: name.trim(), hue, retired: false, owner: ownerId() });
	return { id: row.id, name: row.name, hue: row.hue ?? '' };
}

/** @param {string} id @param {string} name */
export async function renameSphere(id, name) {
	const row = await pb.collection('spheres').update(id, { name: name.trim() });
	return { id: row.id, name: row.name, hue: row.hue ?? '' };
}

/**
 * Retired, not deleted: a sphere stops being offered without taking
 * the jots, people and assets that name it with it.
 * @param {string} id
 */
export function retireSphere(id) {
	return pb.collection('spheres').update(id, { retired: true });
}

/* ── Jots ───────────────────────────────────────────────────────────── */

/**
 * @typedef {{ id: string, text: string, created: string,
 *             organization: string, sphered: string }} JotRow
 */

/**
 * Jots still waiting to be placed, newest first.
 *
 * Only the unplaced ones: a jot filed under an organization has left
 * the queue, which is the whole of what Sphere it does.
 */
export function listJots() {
	return readOr(
		async () => {
			const rows = await pb.collection('jots').getFullList({
				sort: '-created',
				filter: 'archived = null && sphered = null'
			});
			return rows.map((r) => ({
				id: r.id,
				text: r.text,
				created: r.created,
				organization: r.organization ?? '',
				sphered: r.sphered ?? ''
			}));
		},
		() => [],
		[]
	);
}

/**
 * Sphere a jot: file it under the organization it belongs to.
 *
 * A jot names no sphere of its own. The organization is in spheres,
 * and the jot is wherever its organization is — so renaming a sphere,
 * or moving an organization between them, never leaves a jot behind.
 * @param {string} id
 * @param {string} organization  an organization record id
 */
export async function sphereJot(id, organization) {
	const row = await pb
		.collection('jots')
		.update(id, { organization, sphered: new Date().toISOString() });
	return { id: row.id, text: row.text, created: row.created };
}

/**
 * Keep a thrown jot.
 *
 * @param {string} text
 * @returns {Promise<JotRow>}
 */
export async function writeJot(text) {
	const row = await pb.collection('jots').create({ text: text.trim(), owner: ownerId() });
	return {
		id: row.id,
		text: row.text,
		created: row.created,
		organization: row.organization ?? '',
		sphered: row.sphered ?? ''
	};
}

/* ── The asset book ─────────────────────────────────────────────────── */

/**
 * The categories a new account starts with: the lexicon's set. Written
 * once, the first time the book is read, and the Chief's to rename,
 * add to or retire from then on.
 */
const STARTING_CATEGORIES = [
	'Real estate',
	'Vehicle',
	'Equipment',
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

/**
 * @typedef {{ id: string, name: string }} CategoryRow
 * @typedef {{ id: string, asset: string, amount: number, currency: string,
 *             valued_on: string, note: string }} ValuationRow
 * @typedef {{ id: string, holder: { cls: 'organization'|'asset', id: string },
 *             held: { cls: 'organization'|'asset', id: string },
 *             role: 'Owner'|'Manager'|'Guarantor', units: number|null,
 *             since: string }} OwnershipRow
 * @typedef {{
 *   categories: CategoryRow[],
 *   assets: Record<string, any>[],
 *   valuations: ValuationRow[],
 *   ownerships: OwnershipRow[],
 *   liabilities: Record<string, any>[],
 *   cash: Record<string, any>[],
 *   events: Record<string, any>[],
 *   claims: Record<string, any>[],
 *   organizations: OrgRow[]
 * }} BookRows
 */

/**
 * Everything the Asset tab is worked out from, read together so the
 * figures on one screen cannot come from two different moments.
 */
export function readBook() {
	return readOr(
		async () => {
			await selfOrganization();
			const live = { filter: 'archived = null' };
			const [
				categories,
				assets,
				valuations,
				ownerships,
				liabilities,
				cash,
				events,
				claims,
				organizations
			] = await Promise.all([
				ownCategories(),
				pb.collection('assets').getFullList({ sort: 'name', filter: 'archived = null' }),
				pb.collection('valuations').getFullList({ sort: 'valued_on' }),
				pb.collection('ownerships').getFullList({ sort: 'created', filter: 'archived = null' }),
				pb.collection('liabilities').getFullList({ sort: 'name', ...live }),
				pb.collection('cash_entries').getFullList({ sort: '-date', ...live }),
				pb.collection('asset_events').getFullList({ sort: 'happened_on,created', ...live }),
				pb.collection('claims').getFullList({ sort: 'created', ...live }),
				pb.collection('organizations').getFullList({ sort: 'name', filter: 'archived = null' })
			]);
			return /** @type {BookRows} */ ({
				categories,
				assets,
				valuations: valuations.map((v) => ({
					id: v.id,
					asset: v.asset,
					amount: v.amount ?? 0,
					currency: v.currency || 'USD',
					valued_on: v.valued_on,
					note: v.note ?? ''
				})),
				ownerships: ownerships.map(ownership),
				liabilities,
				cash,
				events,
				claims,
				organizations: organizations.map(organization)
			});
		},
		() => /** @type {BookRows|null} */ (null),
		/** @type {BookRows|null} */ ({
			categories: [],
			assets: [],
			valuations: [],
			ownerships: [],
			liabilities: [],
			cash: [],
			events: [],
			claims: [],
			organizations: []
		})
	);
}

/** @returns {Promise<CategoryRow[]>} */
async function ownCategories() {
	const list = () => pb.collection('asset_categories').getFullList({ sort: 'name' });
	let rows = await list();
	if (rows.length === 0) {
		// Never had any, archived ones included: a first visit. One at a
		// time, and a clash is ignored — it means another tab got there.
		for (const name of STARTING_CATEGORIES) {
			try {
				await pb.collection('asset_categories').create({ name, owner: ownerId() });
			} catch {
				/* already there */
			}
		}
		rows = await list();
	}
	return rows.filter((r) => !r.archived).map((r) => ({ id: r.id, name: r.name }));
}

/** @param {string} name @returns {Promise<CategoryRow>} */
export async function createCategory(name) {
	const row = await pb
		.collection('asset_categories')
		.create({ name: name.trim(), owner: ownerId() });
	return { id: row.id, name: row.name };
}

/**
 * @param {{ name: string, category?: string }} fields
 * @returns {Promise<string>} the new asset's id
 */
export async function createAsset(fields) {
	const row = await pb.collection('assets').create({
		name: fields.name.trim(),
		category: fields.category || null,
		quantity: 1,
		units: 10_000,
		valuation: 'whole',
		owner: ownerId()
	});
	return row.id;
}

/**
 * @param {string} id
 * @param {Record<string, any>} fields
 */
export function updateAsset(id, fields) {
	return pb.collection('assets').update(id, fields);
}

/**
 * What an asset was worth on a day. Added, never edited over: the
 * figure it replaces stays on the record as what was believed then.
 * @param {string} asset
 * @param {number} cents
 * @param {string} day  YYYY-MM-DD
 * @param {string} [note]
 */
export function addValuation(asset, cents, day, note = '') {
	return pb.collection('valuations').create({
		asset,
		amount: cents,
		currency: 'USD',
		// Noon UTC, so the day is the same day in every time zone the
		// Chief is likely to read it from.
		valued_on: `${day} 12:00:00.000Z`,
		note: note.trim(),
		owner: ownerId()
	});
}

/** @param {Record<string, any>} r @returns {OwnershipRow} */
function ownership(r) {
	return {
		id: r.id,
		holder: r.holder_org
			? { cls: 'organization', id: r.holder_org }
			: { cls: 'asset', id: r.holder_asset },
		held: r.held_org ? { cls: 'organization', id: r.held_org } : { cls: 'asset', id: r.held_asset },
		role: r.role,
		// Only an owner holds a share. Zero units on anyone else is the
		// number field's way of saying none.
		units: r.role === 'Owner' ? (r.units ?? 0) : null,
		since: r.since || r.created || ''
	};
}

/**
 * @param {{ cls: 'organization'|'asset', id: string }} holder
 * @param {{ cls: 'organization'|'asset', id: string }} held
 * @param {'Owner'|'Manager'|'Guarantor'} role
 * @param {number|null} units  the share, for an owner
 * @param {string} day  YYYY-MM-DD it began
 * @returns {Promise<string>} the new link's id
 */
export async function createOwnership(holder, held, role, units, day) {
	const row = await pb.collection('ownerships').create({
		holder_org: holder.cls === 'organization' ? holder.id : null,
		holder_asset: holder.cls === 'asset' ? holder.id : null,
		held_org: held.cls === 'organization' ? held.id : null,
		held_asset: held.cls === 'asset' ? held.id : null,
		role,
		units: role === 'Owner' ? (units ?? 0) : 0,
		since: `${day} 12:00:00.000Z`,
		owner: ownerId()
	});
	return row.id;
}

/**
 * The two ends are fixed; a different holder is a different link.
 * @param {string} id
 * @param {'Owner'|'Manager'|'Guarantor'} role
 * @param {number|null} units
 * @param {string} day
 */
export function updateOwnership(id, role, units, day) {
	return pb.collection('ownerships').update(id, {
		role,
		units: role === 'Owner' ? (units ?? 0) : 0,
		since: `${day} 12:00:00.000Z`
	});
}

/**
 * @typedef {{
 *   name: string, type: string, borrower: string, lender: string, asset: string,
 *   balance: number|null, startAmount: number|null, payment: number|null,
 *   rate: number|null, frequency: string, months: number|null,
 *   dueDay: number|null, started: string, notes?: string
 * }} LiabilityFields  amounts in cents; `started` is YYYY-MM-DD or ''
 */

/** @param {Partial<LiabilityFields>} f */
function liabilityBody(f) {
	/** @type {Record<string, any>} */
	const body = {};
	if (f.name !== undefined) body.name = f.name.trim();
	if (f.type !== undefined) body.type = f.type;
	if (f.borrower !== undefined) body.borrower = f.borrower;
	if (f.lender !== undefined) body.lender = f.lender || null;
	if (f.asset !== undefined) body.asset = f.asset || null;
	if (f.balance !== undefined) body.balance = f.balance ?? 0;
	if (f.startAmount !== undefined) body.start_amount = f.startAmount ?? 0;
	if (f.payment !== undefined) body.payment = f.payment ?? 0;
	if (f.rate !== undefined) body.rate = f.rate ?? 0;
	if (f.frequency !== undefined) body.frequency = f.frequency || 'Monthly';
	if (f.months !== undefined) body.months = f.months ?? 0;
	if (f.dueDay !== undefined) body.due_day = f.dueDay ?? 0;
	if (f.started !== undefined) body.started = f.started ? `${f.started} 12:00:00.000Z` : null;
	if (f.notes !== undefined) body.notes = f.notes.trim();
	return body;
}

/**
 * @param {Partial<LiabilityFields> & { name: string, borrower: string }} fields
 * @returns {Promise<string>} the new liability's id
 */
export async function createLiability(fields) {
	const row = await pb.collection('liabilities').create({
		frequency: 'Monthly',
		...liabilityBody(fields),
		currency: 'USD',
		owner: ownerId()
	});
	return row.id;
}

/**
 * @param {string} id
 * @param {Partial<LiabilityFields>} fields
 */
export function updateLiability(id, fields) {
	return pb.collection('liabilities').update(id, liabilityBody(fields));
}

/**
 * One dated fact about money. The amount is whole cents and positive;
 * which way it went is in the type.
 * @param {{ label: string, organization: string, type: string, category: string,
 *           amount: number, frequency: string, day: string,
 *           settles?: string, period?: string, liability?: string }} e
 */
export function createCashEntry(e) {
	return pb.collection('cash_entries').create({
		label: e.label.trim(),
		organization: e.organization,
		type: e.type,
		category: e.category,
		amount: e.amount,
		currency: 'USD',
		frequency: e.frequency,
		date: `${e.day} 12:00:00.000Z`,
		settles: e.settles || null,
		period: e.period ?? '',
		liability: e.liability || null,
		owner: ownerId()
	});
}

/**
 * An expected one-off that has now happened: the same entry, moved.
 * @param {string} id
 * @param {string} type  Cash In or Actual Expense
 * @param {number} cents
 * @param {string} day
 */
export function settleCashEntry(id, type, cents, day) {
	return pb
		.collection('cash_entries')
		.update(id, { type, amount: cents, date: `${day} 12:00:00.000Z` });
}

/**
 * A dated line in an asset's history. What the event changed is
 * changed on the asset or its ownership by the caller; this records
 * that it happened.
 * @param {string} asset
 * @param {'Acquired'|'Moved'|'Transferred'|'Upkeep'|'Let go'} type
 * @param {string} detail
 * @param {string} day  YYYY-MM-DD
 * @param {number|null} [cents]
 */
export function createAssetEvent(asset, type, detail, day, cents = null) {
	return pb.collection('asset_events').create({
		asset,
		type,
		detail: detail.trim(),
		amount: cents ?? 0,
		currency: 'USD',
		happened_on: `${day} 12:00:00.000Z`,
		owner: ownerId()
	});
}

/* ── Tasks and endeavors ────────────────────────────────────────────── */

/** @param {Record<string, any>} r @returns {import('./work.js').Task} */
function task(r) {
	return {
		id: r.id,
		name: r.name ?? '',
		state: r.state || 'Now',
		waiting: r.waiting_on ?? '',
		due: String(r.due ?? '').slice(0, 10),
		doneOn: String(r.done_on ?? '').slice(0, 10),
		endeavor: r.endeavor ?? '',
		notes: r.notes ?? ''
	};
}

/** @param {Record<string, any>} r @returns {import('./work.js').Endeavor} */
function endeavor(r) {
	return {
		id: r.id,
		name: r.name ?? '',
		outcome: r.outcome ?? '',
		organization: r.organization ?? '',
		stage: r.stage || 'Active'
	};
}

/**
 * Everything the Action tab reads, together: tasks, the endeavors they
 * go up to, and the organizations those belong to.
 */
export function readWork() {
	return readOr(
		async () => {
			await selfOrganization();
			const live = { filter: 'archived = null' };
			const [tasks, endeavors, orgs] = await Promise.all([
				pb.collection('tasks').getFullList({ sort: 'created', ...live }),
				pb.collection('endeavors').getFullList({ sort: 'name', ...live }),
				pb.collection('organizations').getFullList({ sort: 'name', ...live })
			]);
			return {
				tasks: tasks.map(task),
				endeavors: endeavors.map(endeavor),
				orgs: orgs.map(organization)
			};
		},
		() => sampleWork(),
		{ tasks: [], endeavors: [], orgs: [] }
	);
}

/** A day as PocketBase keeps it, or null for none. @param {string|undefined} day */
const stamp = (day) => (day ? `${day} 12:00:00.000Z` : null);

/** @param {Partial<import('./work.js').Task>} f */
function taskBody(f) {
	/** @type {Record<string, any>} */
	const body = {};
	if (f.name !== undefined) body.name = f.name.trim();
	if (f.state !== undefined) body.state = f.state;
	if (f.waiting !== undefined) body.waiting_on = f.waiting.trim();
	if (f.due !== undefined) body.due = stamp(f.due);
	if (f.doneOn !== undefined) body.done_on = stamp(f.doneOn);
	if (f.endeavor !== undefined) body.endeavor = f.endeavor || null;
	if (f.notes !== undefined) body.notes = f.notes.trim();
	return body;
}

/**
 * @param {Partial<import('./work.js').Task> & { name: string }} fields
 * @param {string} [fromJot]  the jot this task was made from
 */
export async function createTask(fields, fromJot = '') {
	return task(
		await pb.collection('tasks').create({
			state: 'Now',
			...taskBody(fields),
			from_jot: fromJot || null,
			owner: ownerId()
		})
	);
}

/** @param {string} id @param {Partial<import('./work.js').Task>} fields */
export async function updateTask(id, fields) {
	return task(await pb.collection('tasks').update(id, taskBody(fields)));
}

/** @param {{ name: string, outcome: string, organization: string, stage: string }} f */
export async function createEndeavor(f) {
	return endeavor(
		await pb.collection('endeavors').create({
			name: f.name.trim(),
			outcome: f.outcome.trim(),
			organization: f.organization,
			stage: f.stage,
			owner: ownerId()
		})
	);
}

/**
 * @param {string} id
 * @param {Partial<{ name: string, outcome: string, organization: string, stage: string }>} f
 */
export async function updateEndeavor(id, f) {
	return endeavor(await pb.collection('endeavors').update(id, f));
}

/**
 * A jot that became a task has been dealt with, and leaves the queue.
 * It goes under the task's organization when the task has one.
 * @param {string} id
 * @param {string} organization  an organization id, or '' for none yet
 */
export function taskJot(id, organization) {
	return pb
		.collection('jots')
		.update(id, { organization: organization || null, sphered: new Date().toISOString() });
}

/* ── The whole account ──────────────────────────────────────────────── */

/**
 * Every collection an account's records live in, children before the
 * records they point at. Deleting in this order never leaves a record
 * pointing at something already gone.
 */
const OWNED = [
	'sphere_overlaps',
	'claims',
	'tasks',
	'endeavors',
	'cash_entries',
	'liabilities',
	'ownerships',
	'asset_events',
	'valuations',
	'assets',
	'asset_categories',
	'jots',
	'people',
	'organizations',
	'spheres'
];

/**
 * Everything the account holds, as it is stored — archived records
 * included, since a copy that left out what was removed from view
 * would not be a copy.
 *
 * A collection this server does not have yet is reported as missing
 * rather than failing the whole export.
 */
export async function exportAccount() {
	const user = pb.authStore.record;
	/** @type {Record<string, Record<string, any>[]>} */
	const collections = {};
	/** @type {string[]} */
	const missing = [];
	for (const name of [...OWNED].reverse()) {
		try {
			collections[name] = await pb.collection(name).getFullList({ sort: 'created' });
		} catch (/** @type {any} */ err) {
			if (err?.status !== 404) throw err;
			missing.push(name);
		}
	}
	return {
		app: 'Chief',
		format: 1,
		exported_at: new Date().toISOString(),
		account: { id: user?.id ?? '', name: user?.name ?? '', email: user?.email ?? '' },
		note: 'Money is in whole cents. Shares are units out of the asset’s own units (10,000 unless it says otherwise).',
		missing,
		collections
	};
}

/**
 * Remove the account and everything it holds, for good.
 *
 * The records go first, in an order that never strands one, and the
 * account itself last — so if this stops partway the account still
 * exists and can sign in, see what is left, and run it again.
 *
 * @param {(done: number, total: number) => void} [progress]
 */
export async function deleteAccount(progress) {
	const id = ownerId();
	/** @type {[string, string][]} */
	const all = [];
	for (const name of OWNED) {
		try {
			const rows = await pb.collection(name).getFullList({ fields: 'id' });
			for (const r of rows) all.push([name, r.id]);
		} catch (/** @type {any} */ err) {
			if (err?.status !== 404) throw err;
		}
	}
	let done = 0;
	for (const [name, row] of all) {
		await pb.collection(name).delete(row);
		progress?.(++done, all.length);
	}
	await pb.collection('users').delete(id);
	pb.authStore.clear();
}

/**
 * @param {string} current
 * @param {string} next
 */
export async function changePassword(current, next) {
	const user = pb.authStore.record;
	await pb
		.collection('users')
		.update(ownerId(), { oldPassword: current, password: next, passwordConfirm: next });
	// Changing the password ends every session, this one included.
	await pb.collection('users').authWithPassword(user?.email ?? '', next);
}

/** Ask the server to email a reset link. It answers the same whether or not the address is known. */
export function requestPasswordReset(/** @type {string} */ email) {
	return pb.collection('users').requestPasswordReset(email);
}

/* ── How spheres overlap ────────────────────────────────────────────── */

/**
 * Every pair of spheres that overlaps, keyed for lookup. Read with the
 * spheres themselves; a pair that is not here does not overlap.
 * @returns {Promise<{ overlaps: Record<string, number>, ids: Record<string, string> }>}
 */
export async function listOverlaps() {
	const rows = await pb.collection('sphere_overlaps').getFullList();
	/** @type {Record<string, number>} */
	const overlaps = {};
	/** @type {Record<string, string>} */
	const ids = {};
	for (const r of rows) {
		const key = r.a < r.b ? `${r.a}|${r.b}` : `${r.b}|${r.a}`;
		overlaps[key] = Number(r.share);
		ids[key] = r.id;
	}
	return { overlaps, ids };
}

/**
 * Say how much two spheres overlap: 50, 25, or 0 for not at all. None
 * is the absence of a record, so setting it removes one — this is a
 * setting, not a record with a history.
 * @param {string} a @param {string} b
 * @param {number} share
 * @param {string} [existing]  the pair's record id, when it has one
 * @returns {Promise<string>} the pair's record id, or '' for none
 */
export async function writeOverlap(a, b, share, existing = '') {
	const [lo, hi] = a < b ? [a, b] : [b, a];
	if (!share) {
		if (existing) await pb.collection('sphere_overlaps').delete(existing);
		return '';
	}
	if (existing) {
		await pb.collection('sphere_overlaps').update(existing, { share: String(share) });
		return existing;
	}
	const row = await pb
		.collection('sphere_overlaps')
		.create({ a: lo, b: hi, share: String(share), owner: ownerId() });
	return row.id;
}

/* ── Claims ─────────────────────────────────────────────────────────── */

/**
 * Put a claim on file. When the file is to be kept here it is sent
 * with the record; otherwise only its fingerprint is.
 *
 * @param {{
 *   asset: string, kind: string, title: string, source: string,
 *   storage: 'server'|'elsewhere'|'paper', location: string,
 *   hash: string, size: number, fileName: string,
 *   file?: File|null, checked?: string
 * }} c  `checked`: YYYY-MM-DD when the file was fingerprinted just now
 * @returns {Promise<string>} the claim's id
 */
export async function createClaim(c) {
	const body = new FormData();
	const put = (/** @type {string} */ k, /** @type {string} */ v) => body.append(k, v);
	put('asset', c.asset);
	put('kind', c.kind);
	put('title', c.title.trim());
	put('source', c.source.trim());
	put('storage', c.storage);
	put('location', c.location.trim());
	put('hash', c.hash);
	put('size', String(c.size));
	put('file_name', c.fileName);
	if (c.checked) put('checked_on', `${c.checked} 12:00:00.000Z`);
	put('owner', ownerId());
	if (c.storage === 'server' && c.file) body.append('file', c.file);
	const row = await pb.collection('claims').create(body);
	return row.id;
}

/**
 * Record that a claim was checked today — its file matched its
 * fingerprint, or, for paper, the Chief looked at it.
 * @param {string} id
 * @param {string} day  YYYY-MM-DD
 */
export function markClaimChecked(id, day) {
	return pb.collection('claims').update(id, { checked_on: `${day} 12:00:00.000Z` });
}

/**
 * A claim whose file no longer matches its fingerprint is not checked,
 * whatever it was before. It stops counting until it matches again.
 * @param {string} id
 */
export function markClaimFailed(id) {
	return pb.collection('claims').update(id, { checked_on: null });
}

/**
 * The bytes of a claim's file as the server holds them now. Files are
 * protected, so this asks for a short-lived pass first; the link is
 * never one that works on its own.
 * @param {string} id
 * @param {string} stored  the stored file name
 * @returns {Promise<ArrayBuffer>}
 */
export async function claimFile(id, stored) {
	const url = await claimFileUrl(id, stored);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`The file could not be read (${res.status}).`);
	return res.arrayBuffer();
}

/** @param {string} id @param {string} stored */
export async function claimFileUrl(id, stored) {
	const token = await pb.files.getToken();
	return pb.files.getURL({ id, collectionName: 'claims', collectionId: 'claims' }, stored, {
		token
	});
}
