/**
 * A Chief's own spheres.
 *
 * The seven in spheres.js were always a stand-in: real spheres are
 * personal, and the set is nobody's business but the Chief's. Signed
 * in, this is the list they wrote. Signed out, or with no server, the
 * stand-ins show so the app is still worth looking at.
 *
 * Retired, never deleted. A sphere that held a decade of jots should
 * stop being offered without taking them with it.
 */
import { listSpheres, renameSphere, retireSphere, writeSphere } from './pb.js';
import { SPHERES, derivedSphere } from './spheres.js';

/** @typedef {{ id: string, name: string, swatch: string, custom: boolean }} Sphere */

/** @type {{ list: {id: string, name: string, hue: string}[], source: import('./pb.js').Source, error: string, loaded: boolean }} */
export const spheres = $state({ list: [], source: 'fixture', error: '', loaded: false });

/** Whether a sphere made here will outlive the session. */
export const kept = () => spheres.source === 'live';

export async function load() {
	const { data, source, error } = await listSpheres();
	spheres.list = data;
	spheres.source = source;
	spheres.error = error ?? '';
	spheres.loaded = true;
}

/**
 * Every sphere that can be chosen, All life first — it is the default
 * rather than an empty slot, so it belongs in the list it is the
 * default of.
 * @returns {[string, Sphere][]}
 */
export function placeable() {
	const all = /** @type {[string, Sphere]} */ ([
		'all',
		{ ...SPHERES.all, id: 'all', custom: false }
	]);
	if (!kept()) {
		return /** @type {[string, Sphere][]} */ (
			Object.entries(SPHERES).map(([id, s]) => [id, { ...s, id, custom: false }])
		);
	}
	return [all, ...spheres.list.map((s) => /** @type {[string, Sphere]} */ ([s.id, shape(s)]))];
}

/** @param {{ id: string, name: string, hue: string }} row @returns {Sphere} */
function shape(row) {
	return {
		id: row.id,
		name: row.name.toUpperCase(),
		swatch: row.hue || derivedSphere(row.name).swatch,
		custom: true
	};
}

/**
 * A sphere by its id, wherever it came from: the Chief's own list, the
 * stand-ins, or a name typed on a person that is no sphere at all yet.
 * @param {string} id
 * @returns {Sphere}
 */
export function sphereOf(id) {
	const mine = spheres.list.find((s) => s.id === id);
	if (mine) return shape(mine);
	const known = SPHERES[id];
	if (known) return { ...known, id, custom: false };
	return { ...derivedSphere(id), id, custom: true };
}

/** @param {string} name */
export async function addSphere(name) {
	const row = await writeSphere(name);
	spheres.list = [...spheres.list, row];
	return row.id;
}

/** @param {string} id @param {string} name */
export async function rename(id, name) {
	const row = await renameSphere(id, name);
	spheres.list = spheres.list.map((s) => (s.id === id ? row : s));
}

/** @param {string} id */
export async function retire(id) {
	await retireSphere(id);
	spheres.list = spheres.list.filter((s) => s.id !== id);
}
