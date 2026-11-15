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
import {
	listOverlaps,
	listSpheres,
	renameSphere,
	retireSphere,
	writeOverlap,
	writeSphere
} from './pb.js';
import { SAMPLE_OVERLAPS, pairKey, strength, throughFocus, focusTotal } from './focus.js';
import { setSphere, shell } from './state.svelte.js';
import { SPHERES, derivedSphere } from './spheres.js';

/** @typedef {{ id: string, name: string, swatch: string, custom: boolean }} Sphere */

/** @type {{ list: {id: string, name: string, hue: string}[], source: import('./pb.js').Source, error: string, loaded: boolean }} */
export const spheres = $state({ list: [], source: 'fixture', error: '', loaded: false });

/** Whether a sphere made here will outlive the session. */
export const kept = () => spheres.source === 'live';

/**
 * How each pair of spheres overlaps, and the record behind each pair
 * that does. The stand-ins come with a few so the samples show the
 * idea; a Chief's own start with none.
 * @type {{ map: import('./focus.js').Overlaps, ids: Record<string, string>, error: string }}
 */
export const overlaps = $state({ map: { ...SAMPLE_OVERLAPS }, ids: {}, error: '' });

/** @type {Promise<void>|null} A read in flight, shared by everyone who asks during it. */
let reading = null;

export function load() {
	reading ??= read().finally(() => (reading = null));
	return reading;
}

async function read() {
	const { data, source, error } = await listSpheres();
	spheres.list = data;
	spheres.source = source;
	spheres.error = error ?? '';
	if (source === 'live') {
		try {
			const read = await listOverlaps();
			overlaps.map = read.overlaps;
			overlaps.ids = read.ids;
			overlaps.error = '';
		} catch (/** @type {any} */ err) {
			// Without them every sphere stands alone, which hides more than
			// it should. Say so rather than look like a choice.
			overlaps.map = {};
			overlaps.ids = {};
			overlaps.error = err?.message || 'The server did not answer.';
		}
	} else {
		overlaps.map = source === 'error' ? {} : { ...SAMPLE_OVERLAPS };
		overlaps.ids = {};
		overlaps.error = '';
	}
	/* A focus on a sphere that is no longer there would hide everything.
	   The stand-in keys mean nothing in an account's own list, and the
	   other way round. */
	if (shell.sphere !== 'all' && !placeable().some(([k]) => k === shell.sphere)) {
		setSphere('all');
	}
	spheres.loaded = true;
}

/**
 * @param {string} a @param {string} b
 * @param {number} share  50, 25, or 0 for none
 */
export async function setOverlap(a, b, share) {
	const key = pairKey(a, b);
	const id = await writeOverlap(a, b, share, overlaps.ids[key] ?? '');
	const map = { ...overlaps.map };
	const ids = { ...overlaps.ids };
	if (share) {
		map[key] = share;
		ids[key] = id;
	} else {
		delete map[key];
		delete ids[key];
	}
	overlaps.map = map;
	overlaps.ids = ids;
}

/** Whether a sphere is being looked through, rather than All life. */
export const focused = () => shell.sphere !== 'all';

/**
 * How strongly a record stands in the current focus: 100, 50, 25 or 0.
 * @param {string[]} keys  the spheres the record is in
 */
export const strengthOf = (keys) => strength(keys, shell.sphere, overlaps.map);

/**
 * A list as it reads through the current focus.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string[]} spheresOf
 */
export const inFocus = (items, spheresOf) =>
	throughFocus(items, spheresOf, shell.sphere, overlaps.map);

/**
 * A total as it reads through the current focus.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string[]} spheresOf
 * @param {(item: T) => number} valueOf
 */
export const totalInFocus = (items, spheresOf, valueOf) =>
	focusTotal(items, spheresOf, valueOf, shell.sphere, overlaps.map);

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

/**
 * How many of a list the current focus puts out of view.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string[]} spheresOf
 */
export const outOfView = (items, spheresOf) => items.length - inFocus(items, spheresOf).length;
