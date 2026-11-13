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
 * Organizations, in the Lexicon's terms.
 *
 * Every one carries a type code from the C–CN vocabulary, a charter
 * (its intension), the life Spheres it operates in, its members with
 * their membership roles, and its two capacities stated separately:
 * Asset Rights — what it may hold and claim — and Action Stewardship —
 * what it is answerable for having done. An Organization may steward
 * actions over Assets it holds no right in, which is why the two are
 * never collapsed into one list.
 *
 * resolution is a state, not a species: a proposed Organization is a
 * real record that can accumulate evidence and later resolve.
 *
 * Perspective (Me / You / Us / Them) is deliberately absent. It is
 * contextual and derived from membership, never stored here.
 *
 * @type {Record<string, {
 *   name: string, code: string, charter: string, blurb: string,
 *   spheres: string[], resolution: string,
 *   members: { who: string, role: string, kind: string }[],
 *   rights: string[], stewardship: string[],
 *   controls?: string[], controlledBy?: string|null
 * }>}
 */
export const ORGS = {
	tn: {
		name: 'TN Holdings',
		code: 'B',
		charter: 'Hold and steward the family\u2019s assets across generations',
		blurb: 'Parent holding company',
		spheres: ['family', 'business'],
		resolution: 'known',
		members: [
			{ who: 'me', role: 'owner', kind: 'person' },
			{ who: 'june', role: 'owner', kind: 'person' }
		],
		rights: ['Title', 'Transfer', 'Receive income', 'Pledge'],
		stewardship: ['Direct', 'Approve', 'Account for'],
		controls: ['azbolt', 'save'],
		controlledBy: null
	},
	azbolt: {
		name: 'Azbolt',
		code: 'B',
		charter: 'Build and run the Build Suite as a for-profit software company',
		blurb: 'Software company',
		spheres: ['business', 'career'],
		resolution: 'known',
		members: [
			{ who: 'me', role: 'owner', kind: 'person' },
			{ who: 'carmen', role: 'operations', kind: 'person' },
			{ who: 'dev', role: 'co-founder', kind: 'person' }
		],
		rights: ['Title', 'License', 'Receive income', 'Modify'],
		stewardship: ['Direct', 'Perform', 'Report'],
		controls: [],
		controlledBy: 'tn'
	},
	save: {
		name: 'SAVE',
		code: 'DN',
		charter: 'Carry the charitable work of the family holding',
		blurb: 'Nonprofit arm of TN Holdings',
		spheres: ['stewardship', 'community'],
		resolution: 'known',
		members: [{ who: 'me', role: 'trustee', kind: 'person' }],
		rights: ['Receive income', 'Use', 'Benefit'],
		stewardship: ['Safeguard', 'Consecrate', 'Report'],
		controls: [],
		controlledBy: 'tn'
	},
	eagle: {
		name: 'Club Eagle DAO',
		code: 'DO',
		charter: 'Design and build without central control',
		blurb: 'Decentralized development body',
		spheres: ['business'],
		resolution: 'known',
		members: [
			{ who: 'me', role: 'contributor', kind: 'person' },
			{ who: 'dev', role: 'contributor', kind: 'person' }
		],
		rights: ['Voting', 'Access', 'Benefit'],
		stewardship: ['Propose', 'Perform', 'Delegate'],
		controls: [],
		controlledBy: null
	},
	circle: {
		name: 'Circle of Friends',
		code: 'CO',
		charter: 'Hold things in common among friends without a controlling entity',
		blurb: 'Common organization',
		spheres: ['community', 'hobby'],
		resolution: 'known',
		members: [
			{ who: 'me', role: 'member', kind: 'person' },
			{ who: 'sofia', role: 'member', kind: 'person' },
			{ who: 'koa', role: 'member', kind: 'person' }
		],
		rights: ['Use', 'Access'],
		stewardship: ['Contribute', 'Safeguard'],
		controls: [],
		controlledBy: null
	},
	ward: {
		name: 'Cottonwood Ward',
		code: 'CN',
		charter: 'The ecclesiastical body this household belongs to',
		blurb: 'Congregation',
		spheres: ['church'],
		resolution: 'known',
		members: [
			{ who: 'me', role: 'member', kind: 'person' },
			{ who: 'bishop', role: 'bishop', kind: 'person' },
			{ who: 'june', role: 'member', kind: 'person' }
		],
		rights: ['Receive income'],
		stewardship: ['Direct', 'Safeguard', 'Account for'],
		controls: [],
		controlledBy: null
	},
	council: {
		name: 'Ward Council',
		code: 'CC',
		charter: 'Deliberate and decide for the ward on welfare and service',
		blurb: 'Committee of Cottonwood Ward',
		spheres: ['church', 'stewardship'],
		resolution: 'known',
		members: [
			{ who: 'bishop', role: 'chair', kind: 'person' },
			{ who: 'me', role: 'member', kind: 'person' }
		],
		rights: [],
		stewardship: ['Decide', 'Approve', 'Report'],
		controls: [],
		controlledBy: 'ward'
	},
	storage: {
		name: 'Storage Build-out',
		code: 'P',
		charter: 'Coordinate the storage build until it is finished and handed over',
		blurb: 'Project group',
		spheres: ['business'],
		resolution: 'known',
		members: [
			{ who: 'me', role: 'sponsor', kind: 'person' },
			{ who: 'carmen', role: 'responsible', kind: 'person' }
		],
		rights: ['Use'],
		stewardship: ['Direct', 'Perform', 'Account for'],
		controls: [],
		controlledBy: 'azbolt'
	},
	bank: {
		name: 'Deseret First',
		code: 'B',
		charter: 'The lender holding the house note',
		blurb: 'Counterparty \u2014 not a body you belong to',
		spheres: ['family'],
		resolution: 'known',
		members: [],
		rights: ['Receive income', 'Pledge', 'Exclude'],
		stewardship: ['Account for'],
		controls: [],
		controlledBy: null
	},
	fifita: {
		name: 'Fifita Rugby Club',
		code: 'CO',
		charter: 'Run the club and its season',
		blurb: 'Koa\u2019s club \u2014 known, not joined',
		spheres: ['australian rugby'],
		resolution: 'known',
		members: [{ who: 'koa', role: 'captain', kind: 'person' }],
		rights: ['Use'],
		stewardship: ['Direct', 'Perform'],
		controls: [],
		controlledBy: null
	},
	ame: {
		name: 'AME',
		code: 'DO',
		charter: 'An international reserve and exchange body; governance still open',
		blurb: 'Proposed \u2014 governance undecided',
		spheres: ['business'],
		resolution: 'proposed',
		members: [{ who: 'me', role: 'proposer', kind: 'person' }],
		rights: [],
		stewardship: ['Propose'],
		controls: [],
		controlledBy: null
	}
};

/**
 * @type {Record<string, {
 *   name: string, outcome: string, progress: number, milestones: string,
 *   next: string, owner: string, due: string, stats: [string, string][]
 * }>}
 */
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
