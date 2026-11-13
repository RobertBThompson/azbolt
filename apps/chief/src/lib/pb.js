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
 *
 * 'anon' is kept distinct from 'fixture' because they need different
 * words on screen: one is an invitation to sign in, the other is not.
 */
export const pb = createPocketBase('', 'azbolt.chief.pb');

/** @typedef {'live'|'anon'|'fixture'} Source */

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
 * @returns {Promise<{ data: T, source: Source }>}
 */
async function readOr(live, fixture) {
	if (!(await backendUp())) return { data: fixture(), source: 'fixture' };
	if (!pb.authStore.isValid) return { data: fixture(), source: 'anon' };
	try {
		return { data: await live(), source: 'live' };
	} catch {
		// A reachable backend that rejects the read is still a failed read.
		// Showing fixtures beats showing nothing, as long as we say so.
		return { data: fixture(), source: 'fixture' };
	}
}

/** The id every write hangs its `owner` relation on. */
function ownerId() {
	const id = pb.authStore.record?.id;
	if (!id) throw new Error('Not signed in.');
	return id;
}

/** @param {Record<string, any>} p */
const fullName = (p) => [p.first_name, p.last_name].filter(Boolean).join(' ');

/** F1 Directory — D1. Leads with the next interaction, not the job title. */
export function listPeople() {
	return readOr(
		async () => {
			const rows = await pb.collection('people').getFullList({ sort: 'first_name' });
			return rows.map((r) => ({
				id: r.id,
				name: fullName(r),
				meta: [r.role, r.relationship].filter(Boolean).join(' · '),
				// Stored as JSON because spheres are not a collection: a
				// Chief can invent one for a single contact, and a relation
				// would demand a record before the thought is finished.
				spheres: Array.isArray(r.spheres) ? r.spheres : []
			}));
		},
		() =>
			Object.entries(PEOPLE).map(([id, p]) => ({
				id,
				name: p.name,
				meta: `${p.role} · ${p.next}`,
				spheres: p.spheres
			}))
	);
}

/**
 * F1 Directory — D4 Organizations.
 *
 * An organization is a person or a grouping of people, and need not
 * include the Chief: "Wife" and "Chief and Wife" are both organizations.
 * It is not a sphere. A sphere is an area of a life — Family, Business,
 * Church — and lives in spheres.js, not here.
 */
export function listOrganizations() {
	return readOr(
		async () => {
			const rows = await pb.collection('organizations').getFullList({ sort: 'name' });
			return rows.map((r) => ({ id: r.id, name: r.name, meta: r.blurb, kind: r.code }));
		},
		() =>
			Object.entries(ORGS).map(([id, o]) => ({
				id,
				name: o.name,
				meta: o.blurb,
				kind: o.code
			}))
	);
}

/**
 * @param {{ first_name: string, last_name?: string, role?: string,
 *           relationship?: string, organization?: string, notes?: string }} fields
 */
export function createPerson(fields) {
	return pb.collection('people').create({ ...fields, owner: ownerId() });
}

/**
 * `code` is one of the nine organization types, not a free label:
 * C, B, CO, CC, DO, DB, P, DN, CN.
 * @param {{ name: string, code: string, blurb?: string, charter?: string }} fields
 */
export function createOrganization(fields) {
	return pb.collection('organizations').create({ ...fields, owner: ownerId() });
}

