import { createPocketBase, pocketBaseReachable } from '@azbolt/lib/pocketbase';
import { PEOPLE, ORGS } from './data.js';

/**
 * Chief's data layer.
 *
 * PocketBase is proxied under Chief's own origin at /api, so the client
 * needs no base URL and no CORS config. When no instance answers — which
 * is the normal state of the prototype — every read falls back to the
 * design fixtures, so the screens stay usable rather than showing empty
 * lists. `source` tells the UI which it got, because silently showing
 * placeholder data as if it were real is the one failure this must not
 * have.
 */
export const pb = createPocketBase('', 'azbolt.chief.pb');

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
 * @returns {Promise<{ data: T, source: 'live'|'fixture' }>}
 */
async function readOr(live, fixture) {
	if (!(await backendUp())) return { data: fixture(), source: 'fixture' };
	try {
		return { data: await live(), source: 'live' };
	} catch {
		// A reachable backend that rejects the read is still a failed read.
		// Showing fixtures beats showing nothing, as long as we say so.
		return { data: fixture(), source: 'fixture' };
	}
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

/** F1 Directory — D4. An organisation is a workspace with records attached. */
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
