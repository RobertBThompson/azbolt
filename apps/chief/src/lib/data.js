/**
 * Placeholder content, taken verbatim from the v3 experience map so the
 * screens show what the map specifies rather than invented copy.
 * There is no backend yet — see docs/chief/README.md.
 */

/** @type {Record<string, { first: string, name: string, role: string, tags: string[], next: string, endeavors: string, notes: string }>} */
export const PEOPLE = {
	carmen: {
		first: 'Carmen',
		name: 'Carmen Mendez',
		role: 'Operations · Azbolt',
		tags: ['Coworker', 'Decision maker'],
		next: 'Today 3:30 PM',
		endeavors: 'Website launch + 1',
		notes: '3 notes'
	},
	daughter: {
		first: 'My daughter',
		name: 'My daughter',
		role: 'Family',
		tags: ['Family'],
		next: 'Tonight 7:00 PM',
		endeavors: 'None',
		notes: '1 note'
	},
	pamela: {
		first: 'Pamela',
		name: 'Pamela Anderson',
		role: 'CEO · TN Holdings',
		tags: ['Owner', 'Decision maker'],
		next: 'No next interaction',
		endeavors: 'None',
		notes: '2 notes'
	}
};

/**
 * D5-D7 prove the organization profile does not assume a parent company,
 * employees or conventional shares: the same slots hold members,
 * governance and oversight without changing the page architecture.
 * @type {Record<string, { name: string, context: string|null, blurb: string, stats: [string,string][], rows: { t: string, m: string, x: string, href?: string, tone?: string }[] }>}
 */
export const ORGS = {
	azbolt: {
		name: 'Azbolt',
		context: 'azbolt',
		blurb: 'Software company · active sphere',
		stats: [
			['12', 'People'],
			['8', 'Assets'],
			['4', 'Endeavors']
		],
		rows: [
			{
				t: 'Ownership',
				m: 'TN Holdings owns Azbolt',
				x: '↗',
				href: '/records/ownership',
				tone: 'warm'
			},
			{
				t: 'Business plan',
				m: 'Strong on 6 of 11 sections',
				x: '↗',
				href: '/records/plans/overview',
				tone: 'cool'
			}
		]
	},
	tn: {
		name: 'TN Holdings',
		context: 'tn',
		blurb: 'Holding company · owns 4 entities',
		stats: [
			['4', 'Entities'],
			['—', 'Assets'],
			['1', 'Endeavors']
		],
		rows: [
			{
				t: 'Ownership',
				m: 'Root of the ownership tree',
				x: '↗',
				href: '/records/ownership',
				tone: 'warm'
			},
			{
				t: 'Business plan',
				m: 'Coverage not started',
				x: '↗',
				href: '/records/plans',
				tone: 'cool'
			}
		]
	},
	eagle: {
		name: 'Eagle DAO',
		context: null,
		blurb: 'DAO · decentralised work network',
		stats: [
			['—', 'Members'],
			['—', 'Endeavors'],
			['1', 'Treasury']
		],
		rows: [
			{
				t: 'Governance',
				m: 'Member proposals · shared signing',
				x: '↗',
				href: '/records/structure',
				tone: 'cool'
			},
			{
				t: 'Ownership',
				m: 'Member-governed · no parent',
				x: '↗',
				href: '/records/ownership',
				tone: 'warm'
			},
			{ t: 'Rewards', m: 'Contribution rewards active', x: '›', tone: 'warm' }
		]
	},
	save: {
		name: 'SAVE',
		context: null,
		blurb: 'Nonprofit · charity projects',
		stats: [
			['—', 'People'],
			['—', 'Projects'],
			['—', 'Assets']
		],
		rows: [
			{ t: 'Oversight', m: 'Board-governed', x: '↗', href: '/records/structure', tone: 'cool' },
			{ t: 'Funding', m: 'Donations and grants', x: '›', tone: 'warm' },
			{
				t: 'Business plan',
				m: 'Coverage not started',
				x: '↗',
				href: '/records/plans',
				tone: 'cool'
			}
		]
	}
};

/** @type {Record<string, { name: string, outcome: string, progress: number, milestones: string, next: string, owner: string, due: string, stats: [string,string][] }>} */
export const ENDEAVORS = {
	website: {
		name: 'Website launch',
		outcome: 'Outcome: publish a clear purchase path.',
		progress: 0.68,
		milestones: '8 of 12 milestones',
		next: 'Approve homepage',
		owner: 'Robert',
		due: 'Today',
		stats: [
			['5', 'People'],
			['3', 'Assets'],
			['2', 'Risks']
		]
	},
	build: {
		name: 'Build pilot',
		outcome: 'Outcome: one site running end to end.',
		progress: 0.42,
		milestones: '5 of 12 milestones',
		next: 'Unblock Daniel',
		owner: 'Daniel',
		due: 'This week',
		stats: [
			['3', 'People'],
			['6', 'Assets'],
			['1', 'Risks']
		]
	}
};

/** @type {Record<string, { name: string, when: string, who: string, endeavor: string, tags: string[] }>} */
export const TASKS = {
	carmen: {
		name: 'Talk to Carmen',
		when: 'Today · 3:30–3:50 PM',
		who: 'Carmen Mendez',
		endeavor: 'Website launch',
		tags: ['In progress', 'High priority']
	},
	homepage: {
		name: 'Approve homepage',
		when: 'Today · 4:00 PM',
		who: 'Robert',
		endeavor: 'Website launch',
		tags: ['In progress']
	}
};

/** @type {Record<string, { name: string, blurb: string, tags: string[], owner: string, claim: string, valuation: string }>} */
export const ASSETS = {
	'nfta-014': {
		name: 'NFTA artwork #014',
		blurb: 'Tangible artwork with a tokenised claim.',
		tags: ['Verified', 'Insured', 'Stored'],
		owner: 'AME Reserve',
		claim: 'Token linked and verified',
		valuation: 'Reviewed 3 August'
	},
	'studio-collection': {
		name: 'Studio collection',
		blurb: 'Four linked works held together.',
		tags: ['Stored'],
		owner: 'AME Reserve',
		claim: 'Partially verified',
		valuation: 'Valuation 14 months old'
	}
};

/**
 * Jots that have been thrown and not yet sphered.
 *
 * "Untitled" and "no sphere" are the normal state of a fresh jot, not a
 * defect — throwing is meant to cost nothing. This is the queue Sphere It
 * works through.
 *
 * @type {Record<string, { text: string, meta: string, thrown: string }>}
 */
export const UNSPHERED = {
	'j-2041': {
		text: 'Call my daughter, and talk to Carmen ASAP',
		meta: 'Untitled · no sphere · 6:12 PM',
		thrown: '6:12 PM'
	},
	'j-2039': {
		text: 'Check storage before Friday',
		meta: 'Untitled · no sphere · 2:48 PM',
		thrown: '2:48 PM'
	},
	'j-2036': {
		text: 'Ask about the thing before it closes',
		meta: 'Untitled · no sphere · yesterday',
		thrown: 'yesterday'
	}
};
