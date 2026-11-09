/**
 * F0 Shell — spheres.
 *
 * A sphere is an area of a life, not an entity in it: Family, Business,
 * Church, Career, Hobby, Children, Spouse. It is the lens a Chief is
 * looking through at a given moment, and the thing the app is really
 * about — spheres overlap, compete for the same hours, and run up
 * against each other, and deciding between them is the Chief's central
 * dilemma rather than a filing detail.
 *
 * A sphere is emphatically not an organization. An organization is a
 * person or a grouping of people and need not include the Chief at all;
 * "Spouse" is a sphere, while "Wife" and "Chief and Wife" are
 * organizations inside it.
 *
 * 'all' is both every sphere at once and the absence of one. A jot that
 * has not been placed is in All life, which is why there is no separate
 * "unsphered" state anywhere in the app: the default is a real answer,
 * not a blank waiting to be filled.
 *
 * This list is the prototype's stand-in. Real spheres are personal and
 * will be records a Chief writes, not a set shipped in the binary — the
 * seven below are illustrative, not canonical.
 *
 * Each carries three redundant channels, as every context signal in
 * Chief does: a muted hue, a swatch shape, and the name in mono caps.
 * Colour alone never has to survive colour-blindness or sunlight.
 *
 * @type {Record<string, { name: string, swatch: string }>}
 */
export const SPHERES = {
	all: { name: 'ALL LIFE', swatch: 'var(--sph-all)' },
	family: { name: 'FAMILY', swatch: 'var(--sph-family)' },
	spouse: { name: 'SPOUSE', swatch: 'var(--sph-spouse)' },
	children: { name: 'CHILDREN', swatch: 'var(--sph-children)' },
	church: { name: 'CHURCH', swatch: 'var(--sph-church)' },
	career: { name: 'CAREER', swatch: 'var(--sph-career)' },
	business: { name: 'BUSINESS', swatch: 'var(--sph-business)' },
	hobby: { name: 'HOBBY', swatch: 'var(--sph-hobby)' }
};

/**
 * Every sphere a jot can be placed in, All life included — it is the
 * default rather than an empty slot, so it belongs in the list it is the
 * default of.
 */
export const PLACEABLE = Object.entries(SPHERES);

/**
 * Spheres a person can be placed in are not limited to the list above.
 * A contact may belong to an area of life the Chief does not otherwise
 * deal in — "Australian Rugby" — and inventing one should cost nothing
 * more than typing it.
 *
 * Known keys keep their swatch. Anything else gets a stable colour
 * derived from the name itself, so the same custom sphere looks the same
 * everywhere without being stored anywhere.
 *
 * @param {string} key
 * @returns {{ name: string, swatch: string, custom: boolean }}
 */
export function sphereOf(key) {
	const known = SPHERES[key];
	if (known) return { ...known, custom: false };

	// Muted, in the same saturation and lightness band as the set above,
	// so an invented sphere never looks louder than a real one.
	const HUES = ['#7a6a86', '#6b7f8c', '#8a6a5c', '#6f8060', '#87707f', '#6e7a95'];
	let h = 0;
	for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
	return {
		name: key.toUpperCase(),
		swatch: HUES[h % HUES.length],
		custom: true
	};
}
