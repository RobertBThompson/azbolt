/**
 * Placeholder content, taken verbatim from the v3 experience map so the
 * screens show what the map specifies rather than invented copy.
 * There is no backend yet — see docs/chief/README.md.
 */

/**
 * @type {Record<string, {
 *   first: string, name: string, role: string, spheres: string[],
 *   strength: string, last: string, next: string, cadence: string,
 *   email: string, phone: string, endeavors: string, notes: string
 * }>}
 */
export const PEOPLE = {
	carmen: {
		first: 'Carmen',
		name: 'Carmen Ruiz',
		role: 'Operations lead',
		spheres: ['business', 'career'],
		strength: 'steady',
		last: '4 days ago',
		next: 'Today 3:30 PM',
		cadence: 'Weekly',
		email: 'carmen@azbolt.example',
		phone: '+1 555 0148',
		endeavors: 'Storage build-out',
		notes: 'Prefers a call to a message. Reads nothing after 8 PM.'
	},
	maia: {
		first: 'Maia',
		name: 'Maia Thompson',
		role: 'Daughter',
		spheres: ['children', 'family'],
		strength: 'strong',
		last: 'Yesterday',
		next: 'Tonight 7:00 PM',
		cadence: 'Every few days',
		email: 'maia@example.com',
		phone: '+1 555 0102',
		endeavors: '—',
		notes: 'Finals in three weeks. Ask about the recital, not the grades.'
	},
	june: {
		first: 'June',
		name: 'June Okafor',
		role: 'Spouse',
		spheres: ['spouse', 'family'],
		strength: 'strong',
		last: 'Today',
		next: 'Saturday morning',
		cadence: 'Daily',
		email: 'june@example.com',
		phone: '+1 555 0111',
		endeavors: 'House refinance',
		notes: 'Anniversary 14 June. Hates surprises, loves plans.'
	},
	bishop: {
		first: 'Elias',
		name: 'Elias Moreau',
		role: 'Bishop',
		spheres: ['church'],
		strength: 'steady',
		last: 'Sunday',
		next: 'Sunday after the meeting',
		cadence: 'Weekly',
		email: 'elias@example.org',
		phone: '+1 555 0163',
		endeavors: 'Service rota',
		notes: 'Asked twice about the welfare visit. Follow through.'
	},
	dev: {
		first: 'Dev',
		name: 'Dev Patel',
		role: 'Co-founder',
		spheres: ['business'],
		strength: 'fading',
		last: '6 weeks ago',
		next: 'Not scheduled',
		cadence: 'Monthly',
		email: 'dev@example.com',
		phone: '+1 555 0177',
		endeavors: 'Series A memo',
		notes: 'Went quiet after the valuation conversation.'
	},
	nan: {
		first: 'Nan',
		name: 'Nan Whitfield',
		role: 'Grandmother',
		spheres: ['family'],
		strength: 'fading',
		last: '5 weeks ago',
		next: 'Not scheduled',
		cadence: 'Fortnightly',
		email: '—',
		phone: '+1 555 0190',
		endeavors: '—',
		notes: 'Landline only. Mornings are better.'
	},
	koa: {
		first: 'Koa',
		name: 'Koa Fifita',
		role: 'Club captain',
		/* A sphere the Chief does not otherwise deal in. Invented on the
		   spot, and nothing had to be configured first. */
		spheres: ['australian rugby'],
		strength: 'new',
		last: 'Last month',
		next: 'Not scheduled',
		cadence: 'Occasional',
		email: 'koa@example.au',
		phone: '+61 400 555 012',
		endeavors: '—',
		notes: 'Met at the tournament. Said to call if ever in Brisbane.'
	},
	sofia: {
		first: 'Sofia',
		name: 'Sofia Lindqvist',
		role: 'Mentor',
		spheres: ['career', 'hobby'],
		strength: 'steady',
		last: '2 weeks ago',
		next: 'Month end',
		cadence: 'Monthly',
		email: 'sofia@example.se',
		phone: '+46 70 555 0133',
		endeavors: 'Woodwork bench',
		notes: 'Always asks what you stopped doing, not what you started.'
	}
};

/**
 * context is null for an organization that belongs to no sphere of the
 * Chief's own, and a row has no href when it is not yet a destination.
 *
 * @type {Record<string, {
 *   name: string, context: string|null, blurb: string,
 *   stats: [string, string][],
 *   rows: { t: string, m: string, x: string, href?: string, tone: string }[]
 * }>}
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
 * A fresh jot is untitled and in All life. Neither is a defect — throwing
 * is meant to cost nothing, and All life is a real placement rather than
 * a blank. This is the queue Sphere It works through.
 *
 * @type {Record<string, { text: string, meta: string, thrown: string }>}
 */
export const UNSPHERED = {
	'j-2041': {
		text: 'Call my daughter, and talk to Carmen ASAP',
		meta: 'Untitled · all life · 6:12 PM',
		thrown: '6:12 PM'
	},
	'j-2039': {
		text: 'Check storage before Friday',
		meta: 'Untitled · all life · 2:48 PM',
		thrown: '2:48 PM'
	},
	'j-2036': {
		text: 'Ask about the thing before it closes',
		meta: 'Untitled · all life · yesterday',
		thrown: 'yesterday'
	}
};
