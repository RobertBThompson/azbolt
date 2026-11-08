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

/** Everything a jot can actually be placed in — 'all' is a view, not a home. */
export const PLACEABLE = Object.entries(SPHERES).filter(([key]) => key !== 'all');
