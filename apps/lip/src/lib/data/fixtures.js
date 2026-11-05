/**
 * Fixture data standing in for the Supabase schema.
 *
 * Shapes here mirror the intended tables (entities, entity_measurements,
 * qc_queue, boycott_actions) so swapping in real queries is a change of
 * source, not a change of component.
 *
 * Scores are continuous -5.0 to +5.0 on both axes. The five bins
 * (L, CL, C, CR, R) are a display convention over that continuum, never
 * the storage format.
 */

/**
 * @typedef {'person' | 'company' | 'media' | 'bill' | 'you'} ObjectType
 * @typedef {'proposed' | 'review' | 'contested' | 'locked' | 'reopened' | 'withdrawn'} ObjectState
 */

/**
 * @typedef {object} Position
 * @property {number} fiscal
 * @property {number} social
 * @property {[number, number]} [fiscalRange]  Present only when contested.
 * @property {[number, number]} [socialRange]
 */

/**
 * @typedef {object} LipObject
 * @property {string} id
 * @property {string} name
 * @property {ObjectType} type
 * @property {string} kind              Sub-label, e.g. "advertising + investment".
 * @property {ObjectState} state
 * @property {Position} position        Output 1 — Expressed Position. The ONLY
 *                                      output that may be plotted on the map.
 * @property {{ left: number, right: number }} [footprint]
 *                                      Output 2 — Support Footprint. Two
 *                                      independent directional weights. Never
 *                                      averaged: 82 left + 74 right is not Center.
 * @property {{ fromLeft: number, fromRight: number }} [pressure]
 *                                      Output 3 — Boycott Pressure.
 * @property {number} confidence        0-100, AI confidence.
 * @property {number} coverage          0-100. Below 40 renders Provisional.
 * @property {number} evidenceCount
 * @property {{ issue: string, score: number }[]} [issues]
 */

/** @type {LipObject[]} */
export const objects = [
	{
		id: 'northbay',
		name: 'Northbay Foods',
		type: 'company',
		kind: 'Company · advertising + investment',
		state: 'locked',
		position: { fiscal: 1.8, social: 2.6 },
		footprint: { left: 82, right: 74 },
		pressure: { fromLeft: 61, fromRight: 68 },
		confidence: 88,
		coverage: 79,
		evidenceCount: 38,
		issues: [
			{ issue: 'Taxes', score: 2.4 },
			{ issue: 'Labor', score: -1.1 },
			{ issue: 'Environment', score: 0.9 },
			{ issue: 'Trade', score: 2.2 }
		]
	},
	{
		id: 'mercer',
		name: 'Jane Mercer',
		type: 'person',
		kind: 'Candidate · US Senate',
		state: 'locked',
		position: { fiscal: 2.3, social: 1.4 },
		confidence: 82,
		coverage: 74,
		evidenceCount: 126,
		issues: [
			{ issue: 'Taxes', score: 2.1 },
			{ issue: 'Spending', score: 1.7 },
			{ issue: 'Healthcare', score: 2.4 },
			{ issue: 'Immigration', score: 0.8 },
			{ issue: 'Guns', score: 2.7 },
			{ issue: 'Environment', score: -1.9 }
		]
	},
	{
		id: 'whole-story',
		name: 'The Whole Story',
		type: 'media',
		kind: 'Program · weekly documentary',
		state: 'contested',
		// Contested: the spec forbids collapsing bimodal disagreement into a
		// misleading average, so the range is the measurement.
		position: { fiscal: -2.25, social: -1.6, fiscalRange: [-2.8, -1.7] },
		confidence: 82,
		coverage: 64,
		evidenceCount: 44,
		issues: [
			{ issue: 'Immigration', score: -2.4 },
			{ issue: 'Healthcare', score: -2.1 }
		]
	},
	{
		id: 'geico',
		name: 'GEICO',
		type: 'company',
		kind: 'Company · advertiser',
		state: 'review',
		position: { fiscal: 0.2, social: 0.3 },
		footprint: { left: 54, right: 57 },
		pressure: { fromLeft: 54, fromRight: 57 },
		confidence: 71,
		coverage: 58,
		evidenceCount: 19
	},
	{
		id: 'arden',
		name: 'Arden Group',
		type: 'company',
		kind: 'Company · parent / ownership',
		state: 'review',
		position: { fiscal: -1.1, social: -0.8 },
		footprint: { left: 19, right: 8 },
		pressure: { fromLeft: 19, fromRight: 8 },
		confidence: 66,
		coverage: 51,
		evidenceCount: 12
	},
	{
		id: 'hr901',
		name: 'H.R. 901',
		type: 'bill',
		kind: 'Bill · 119th Congress',
		state: 'proposed',
		position: { fiscal: -0.7, social: 1.9 },
		confidence: 54,
		// Below the 40% coverage floor — must render Provisional, never as settled.
		coverage: 31,
		evidenceCount: 6
	},
	{
		id: 'solace',
		name: 'Solace Health',
		type: 'company',
		kind: 'Company · low political exposure',
		state: 'locked',
		position: { fiscal: 2.8, social: 2.4 },
		footprint: { left: 4, right: 7 },
		confidence: 77,
		coverage: 69,
		evidenceCount: 9
	},
	{
		id: 'daily-wire',
		name: 'Daily Report',
		type: 'media',
		kind: 'Program · daily commentary',
		state: 'locked',
		position: { fiscal: 3.5, social: 2.1 },
		confidence: 85,
		coverage: 81,
		evidenceCount: 97
	}
];

/** The signed-in user's own position. Private by default. */
export const me = {
	id: 'me',
	name: 'You',
	type: /** @type {ObjectType} */ ('you'),
	position: { fiscal: 0.8, social: 1.6 },
	bin: /** @type {'L'|'CL'|'C'|'CR'|'R'} */ ('CR'),
	completedAt: '16 Aug',
	private: true
};

/** Map view presets. Each is a lens over the same objects, not a new dataset. */
export const views = [
	{
		id: 'my',
		label: 'My LIP',
		title: 'Where I lean',
		meta: 'Private · completed 16 Aug',
		ids: ['me']
	},
	{
		id: 'trending',
		label: 'Trending',
		title: 'Trending across LIP',
		meta: 'Attention, not agreement · live',
		ids: ['whole-story', 'geico', 'mercer', 'hr901', 'daily-wire', 'northbay']
	},
	{
		id: 'companies',
		label: 'Companies',
		title: 'Where companies speak and spend',
		meta: 'Dot = expressed position only',
		ids: ['northbay', 'geico', 'arden', 'solace']
	},
	{
		id: 'pressure',
		label: 'Boycott Pressure',
		title: 'Where boycott pressure is building',
		// Deliberate wording: this lens sizes by action, it does not plot a stance.
		meta: 'Action lens · not a political position',
		ids: ['northbay', 'geico', 'arden']
	}
];

/** Home activity rail. mode drives the Measure / Verify / Act treatment. */
export const activity = [
	{
		mode: /** @type {'measure'|'verify'|'act'} */ ('act'),
		title: 'Northbay · two active pressures',
		detail: 'From Left 61 · From Right 68',
		badge: 'OPEN',
		href: '/act/northbay'
	},
	{
		mode: /** @type {'measure'|'verify'|'act'} */ ('verify'),
		title: 'Northbay fiscal footprint needs your bin',
		detail: '3 new FEC filings · you are Center Right',
		badge: 'CR',
		href: '/qc'
	},
	{
		mode: /** @type {'measure'|'verify'|'act'} */ ('measure'),
		title: 'The Whole Story is contested',
		detail: 'Fiscal −2.8 to −1.7 · quorum unmet in CR',
		badge: '',
		href: '/object/whole-story'
	}
];

/** QC queue. Items are prioritised by whether they need the user's bin. */
export const qcQueue = [
	{
		id: 'qc-1',
		objectId: 'northbay',
		object: 'Northbay Foods',
		issue: 'Fiscal footprint',
		note: '3 new FEC filings added since last measured.',
		state: /** @type {ObjectState} */ ('review'),
		proposed: 1.8,
		confidence: 78,
		coverage: 52,
		quorum: { L: 12, CL: 9, C: 7, CR: 0, R: 0 },
		needsBin: 'CR'
	},
	{
		id: 'qc-2',
		objectId: 'whole-story',
		object: 'The Whole Story',
		issue: 'Immigration',
		note: 'Dissent is bimodal; a single point score would misrepresent it.',
		state: /** @type {ObjectState} */ ('contested'),
		proposed: -2.4,
		confidence: 82,
		coverage: 64,
		quorum: { L: 28, CL: 19, C: 31, CR: 0, R: 8 },
		needsBin: 'CR'
	},
	{
		id: 'qc-3',
		objectId: 'hr901',
		object: 'H.R. 901',
		issue: 'Spending',
		note: 'Coverage below the 40% floor — cannot leave Provisional yet.',
		state: /** @type {ObjectState} */ ('proposed'),
		proposed: -0.7,
		confidence: 54,
		coverage: 31,
		quorum: { L: 4, CL: 2, C: 1, CR: 0, R: 0 },
		needsBin: 'CR'
	}
];

/**
 * Boycott gate. All four conditions must be independently true before the
 * JOIN button leaves its inert state — the spec's main guard against the
 * product becoming an outrage engine.
 */
export const boycotts = {
	northbay: {
		objectId: 'northbay',
		object: 'Northbay Foods',
		strength: 72,
		severity: 68,
		triggeringSide: /** @type {'left'|'right'} */ ('right'),
		humanReviewed: true,
		durationDays: 7,
		participating: 12481,
		conditions: [
			{
				id: 'severity',
				label: 'Severity threshold met — pressure ≥ 60 on the triggering side',
				met: true
			},
			{ id: 'instances', label: '12 independently verified instances', met: true },
			{ id: 'attribution', label: 'Attribution confidence ≥ 75%', met: true },
			{ id: 'cooloff', label: 'Cool-off and right-of-reply window — 2 of 3 days elapsed', met: false }
		],
		remediation: [
			{ label: 'Policy correction published', effect: 'Severity −12' },
			{ label: 'Ad placement paused', effect: 'Exposure −8' },
			{ label: 'Independent review opened', effect: 'Confidence unchanged' }
		]
	}
};

/** Attribution chain. Weights fall off by control type — never copied flat. */
export const attribution = [
	{ label: 'Instance', score: -3.2, weight: 100, basis: 'Direct measurement' },
	{ label: 'Episode', score: -2.6, weight: 81, basis: 'Editorial control' },
	{ label: 'Show', score: -1.9, weight: 58, basis: 'Editorial control' },
	{ label: 'Network', score: -1.1, weight: 34, basis: 'Production' },
	{ label: 'Investor', score: -0.06, weight: 5.5, basis: 'Ownership share' }
];

/** @param {string} id */
export function getObject(id) {
	return objects.find((o) => o.id === id);
}

/**
 * Five display bins over the continuous -5..+5 scale.
 * @param {number} score
 */
export function binOf(score) {
	if (score <= -3) return 'L';
	if (score <= -1) return 'CL';
	if (score < 1) return 'C';
	if (score < 3) return 'CR';
	return 'R';
}

/** @param {number} score */
export function binLabel(score) {
	return { L: 'Left', CL: 'Center Left', C: 'Center', CR: 'Center Right', R: 'Right' }[
		binOf(score)
	];
}

/** Coverage below this renders Provisional rather than passing as settled. */
export const COVERAGE_FLOOR = 40;
