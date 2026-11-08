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
				meta: [r.role, r.relationship].filter(Boolean).join(' · ')
			}));
		},
		() =>
			Object.entries(PEOPLE).map(([id, p]) => ({
				id,
				name: p.name,
				meta: `${p.role} · ${p.next}`
			}))
	);
}

/** F1 Directory — D4. An organization is a workspace with records attached. */
export function listWorkspaces() {
	return readOr(
		async () => {
			const rows = await pb.collection('workspaces').getFullList({ sort: 'name' });
			return rows.map((r) => ({ id: r.id, name: r.name, meta: r.blurb, kind: r.kind }));
		},
		() =>
			Object.entries(ORGS).map(([id, o]) => ({
				id,
				name: o.name,
				meta: o.blurb,
				kind: 'company'
			}))
	);
}

/**
 * @param {{ first_name: string, last_name?: string, role?: string,
 *           relationship?: string, workspace?: string, notes?: string }} fields
 */
export function createPerson(fields) {
	return pb.collection('people').create({ ...fields, owner: ownerId() });
}

/**
 * @param {{ name: string, kind: string, blurb?: string,
 *           swatch?: string, hue?: string }} fields
 */
export function createWorkspace(fields) {
	return pb.collection('workspaces').create({
		swatch: 'solid',
		...fields,
		owner: ownerId()
	});
}

/**
 * Writes the design fixtures in as real, owned records.
 *
 * A fresh account reads an empty Directory, which is correct but looks
 * identical to a broken one. This makes the round trip visible: the same
 * names arrive back through the API, owned by the signed-in user, and
 * the screens stop saying they are showing placeholders.
 *
 * Not idempotent by itself — the unique index on (owner, name) is what
 * stops a second run duplicating workspaces, and the caller only offers
 * it when the live lists come back empty.
 *
 * @returns {Promise<{ people: number, workspaces: number }>}
 */
export async function seedDirectory() {
	const owner = ownerId();

	/** @type {Record<string, string>} */
	const workspaceIds = {};
	for (const [key, o] of Object.entries(ORGS)) {
		const row = await pb.collection('workspaces').create({
			name: o.name,
			kind: 'company',
			blurb: o.blurb,
			swatch: 'solid',
			hue: o.context ?? '',
			owner
		});
		workspaceIds[key] = row.id;
	}

	let people = 0;
	for (const p of Object.values(PEOPLE)) {
		// Fixtures carry one display name; split on the first space so the
		// stored shape matches what the form writes rather than dumping
		// everything into first_name.
		const [first, ...rest] = String(p.name).split(' ');
		// "Operations · Azbolt" — the part after the separator names the org.
		const [role, orgName] = String(p.role)
			.split('·')
			.map((s) => s.trim());
		const match = Object.entries(ORGS).find(([, o]) => o.name === orgName);
		await pb.collection('people').create({
			first_name: first,
			last_name: rest.join(' '),
			role,
			relationship: p.tags?.[0] ?? '',
			workspace: match ? workspaceIds[match[0]] : '',
			owner
		});
		people += 1;
	}

	return { people, workspaces: Object.keys(workspaceIds).length };
}
