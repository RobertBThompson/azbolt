import { createPocketBase, pocketBaseReachable } from '@azbolt/lib/pocketbase';
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
 *             sphere: string, sphered: string }} JotRow
 */

/**
 * Jots still waiting to be placed, newest first.
 *
 * Only the unplaced ones: a jot that has been given a sphere has left
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
				sphere: r.sphere ?? '',
				sphered: r.sphered ?? ''
			}));
		},
		() => [],
		[]
	);
}

/**
 * Place a jot in a sphere. An empty sphere means all life, which is a
 * real answer rather than a blank, so it still counts as placed.
 * @param {string} id
 * @param {string} sphere  a sphere record id, or '' for all life
 */
export async function sphereJot(id, sphere) {
	const row = await pb
		.collection('jots')
		.update(id, { sphere: sphere || null, sphered: new Date().toISOString() });
	return { id: row.id, text: row.text, created: row.created, sphere: row.sphere ?? '' };
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
		sphere: row.sphere ?? '',
		sphered: row.sphered ?? ''
	};
}
