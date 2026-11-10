/**
 * Organization Type — the canonical Build vocabulary.
 *
 * From the Lexicon's Organization-Centric revision: Organization is the
 * single actor class, and these nine codes say what kind of body is
 * acting. They are emphatically not Spheres — a Sphere is an area of
 * living (work, church, family), while a type is what sort of thing is
 * doing the acting. One Organization of any type may operate across
 * several Spheres, and one Sphere holds Organizations of many types.
 *
 * The control rule matters and is enforced in the UI: C is the only type
 * capable of control, because it is the only type that is itself an
 * intelligence. Every other type is a combination of Organizations, and
 * governs how Cs are tied together.
 *
 * @type {Record<string, {
 *   code: string, name: string, intension: string,
 *   identification: string, controls: boolean
 * }>}
 */
export const ORG_TYPES = {
	C: {
		code: 'C',
		name: 'Individual',
		intension: 'A single person acting in their own standing — the smallest complete Organization',
		identification: 'Personal identifier',
		controls: true
	},
	B: {
		code: 'B',
		name: 'Business',
		intension: 'A formal commercial or legal entity',
		identification: 'Registration',
		controls: false
	},
	CO: {
		code: 'CO',
		name: 'Common Organization',
		intension: 'Joined around a shared purpose without a single controlling entity',
		identification: 'Charter or stated commonality',
		controls: false
	},
	CC: {
		code: 'CC',
		name: 'Common Committee',
		intension: 'A smaller deliberative or governing body acting for other Organizations',
		identification: 'Charter or appointment',
		controls: false
	},
	DO: {
		code: 'DO',
		name: 'Decentralized Organization',
		intension: 'Designed to operate without central control, including DAO forms',
		identification: 'Protocol or governance rules',
		controls: false
	},
	DB: {
		code: 'DB',
		name: 'Decentralized Branches',
		intension: 'Semi-autonomous branches under a decentralized model',
		identification: 'Branch charter',
		controls: false
	},
	P: {
		code: 'P',
		name: 'Project Group',
		intension: 'Organizations gathered around a specific project or undertaking',
		identification: 'Project charter',
		controls: false
	},
	DN: {
		code: 'DN',
		name: 'Decentralized Charity',
		intension: 'A nonprofit or consecrated body on a decentralized model',
		identification: 'Charter or nonprofit standing',
		controls: false
	},
	CN: {
		code: 'CN',
		name: 'Church',
		intension: 'Ecclesiastical Organizations',
		identification: 'Ecclesiastical standing',
		controls: false
	}
};

/** @param {string} code */
export function orgType(code) {
	return ORG_TYPES[code] ?? ORG_TYPES.CO;
}

/**
 * Perspective is contextual, never stored on the Organization itself.
 * An Organization whose membership includes Me is Us; one that does not
 * is Them. Me is the Chief, and is resolved elsewhere.
 *
 * @param {{ members?: { who: string }[] }} org
 * @returns {'Us'|'Them'}
 */
export function perspective(org) {
	return (org.members ?? []).some((m) => m.who === 'me') ? 'Us' : 'Them';
}
