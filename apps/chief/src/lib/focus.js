/**
 * Decision 10: a sphere is a focus, not a filter.
 *
 * Looking through a sphere does not cut everything else away. What is
 * in it stands at full strength; what is in a sphere it overlaps is
 * still there, quieter; what is only in spheres it does not overlap is
 * out of view. All life is every sphere at once, everything equal.
 *
 * Each pair of spheres overlaps by half, by a quarter, or not at all,
 * and the Chief says which.
 */

/** @typedef {Record<string, number>} Overlaps  keyed by pairKey; 25 or 50 */
/** @typedef {'full'|'related'|'hidden'} Standing */

/** One key for a pair, whichever way round it is asked. @param {string} a @param {string} b */
export const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * How much two spheres overlap, as a percentage: 100 for a sphere and
 * itself, otherwise 50, 25 or 0.
 * @param {string} a @param {string} b @param {Overlaps} overlaps
 */
export const overlap = (a, b, overlaps) => (a === b ? 100 : (overlaps[pairKey(a, b)] ?? 0));

/**
 * How strongly a record stands when looking through `focus`, from the
 * spheres it is in: the strongest tie any of them has to the focus.
 *
 * A record in no sphere stands at nothing under a focus. It belongs
 * to All life only, where everything stands equal.
 * @param {string[]} spheres  the spheres the record is in
 * @param {string} focus      a sphere id, or 'all'
 * @param {Overlaps} overlaps
 * @returns {number} 100, 50, 25 or 0
 */
export function strength(spheres, focus, overlaps) {
	if (focus === 'all') return 100;
	return spheres.reduce((most, s) => Math.max(most, overlap(s, focus, overlaps)), 0);
}

/** @param {number} percent @returns {Standing} */
export const standingOf = (percent) =>
	percent >= 100 ? 'full' : percent > 0 ? 'related' : 'hidden';

/**
 * A list as it reads through a focus: the hidden left out, what is in
 * the focus first, then the related — closest first — each in the
 * order it came in.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string[]} spheresOf
 * @param {string} focus
 * @param {Overlaps} overlaps
 * @returns {{ item: T, strength: number, quiet: boolean }[]}
 */
export function throughFocus(items, spheresOf, focus, overlaps) {
	return items
		.map((item, at) => ({ item, at, strength: strength(spheresOf(item), focus, overlaps) }))
		.filter((x) => x.strength > 0)
		.sort((x, y) => y.strength - x.strength || x.at - y.at)
		.map(({ item, strength: s }) => ({ item, strength: s, quiet: s < 100 }));
}

/**
 * A total as it reads through a focus: what is in the focus leads,
 * and what is in related spheres is given beside it, never added in.
 * Under All life there is one figure and nothing beside it.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string[]} spheresOf
 * @param {(item: T) => number} valueOf
 * @param {string} focus
 * @param {Overlaps} overlaps
 */
export function focusTotal(items, spheresOf, valueOf, focus, overlaps) {
	let focused = 0;
	let related = 0;
	for (const item of items) {
		const s = strength(spheresOf(item), focus, overlaps);
		if (s >= 100) focused += valueOf(item);
		else if (s > 0) related += valueOf(item);
	}
	return { focused, related };
}

/**
 * The stand-in spheres' overlaps, so the samples show the idea. A
 * Chief's own are theirs to set.
 * @type {Overlaps}
 */
export const SAMPLE_OVERLAPS = {
	[pairKey('family', 'spouse')]: 50,
	[pairKey('family', 'children')]: 50,
	[pairKey('spouse', 'children')]: 50,
	[pairKey('family', 'church')]: 25,
	[pairKey('career', 'business')]: 50,
	[pairKey('business', 'family')]: 25
};
