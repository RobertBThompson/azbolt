/**
 * Tasks and endeavors: the words, the order, and the sums.
 *
 * Kept apart from the screens so the rules can be tested without one:
 * what counts as late, what order a list reads in, and how far along
 * an endeavor is.
 */
import { dayLabel, inSentence } from './assets.js';

/** Decision 8: when, in four words. Waiting is a tag, not a state. */
export const TASK_STATES = ['Now', 'Soon', 'Later', 'Done'];
export const ENDEAVOR_STAGES = ['Active', 'Planned', 'Done'];

/**
 * How big a task is, in three words. Rough on purpose: a guess typed
 * in hours is still a guess, and slower to type (Robert, 19 Nov).
 */
export const EFFORTS = ['Small', 'Medium', 'Large'];

/**
 * @typedef {{
 *   id: string, name: string, state: string, waiting: string,
 *   due: string, doneOn: string, endeavor: string, notes: string,
 *   asset: string, effort: string, gain: number
 * }} Task  `due` and `doneOn` are YYYY-MM-DD, or '' for none. `asset`
 *   is what the task works on, or ''. `effort` is one of EFFORTS, or ''.
 *   `gain` is what it should add, in cents; 0 is none given.
 * @typedef {{
 *   id: string, name: string, outcome: string, organization: string, stage: string,
 *   sphere: string
 * }} Endeavor  `sphere` is the one sphere a "Build" endeavor builds, or ''.
 * @typedef {{ id: string, name: string, code: string, spheres: string[], self: boolean }} WorkOrg
 */

/** @param {string} day YYYY-MM-DD */
export const dateOf = (day) => {
	const [y, m, d] = day.split('-').map(Number);
	return new Date(y, m - 1, d);
};

/** @param {Date} d */
const dayString = (d) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Whether an open task's day has passed. A done task is never late.
 * @param {Task} t
 * @param {Date} [now]
 */
export const isLate = (t, now = new Date()) =>
	t.state !== 'Done' && t.due !== '' && t.due < dayString(now);

/**
 * The line under a task's name: when it is due, what it is for, and
 * what it is waiting on — only the parts that exist.
 * @param {Task} t
 * @param {Endeavor[]} endeavors
 * @param {Date} [now]
 */
export function taskLine(t, endeavors, now = new Date()) {
	/** @type {string[]} */
	const parts = [];
	if (t.state === 'Done') {
		if (t.doneOn) parts.push(`Done ${inSentence(dayLabel(dateOf(t.doneOn), now))}`);
	} else if (t.due) {
		const label = dayLabel(dateOf(t.due), now);
		parts.push(isLate(t, now) ? `Was due ${inSentence(label)}` : `Due ${inSentence(label)}`);
	}
	const e = endeavors.find((x) => x.id === t.endeavor);
	if (e) parts.push(e.name);
	if (t.waiting && t.state !== 'Done') parts.push(`Waiting on ${t.waiting}`);
	return parts.join(' · ');
}

/**
 * The order a list of tasks reads in: late first, then by day, with
 * the undated after the dated. Done tasks read newest first.
 * @param {Task[]} tasks
 */
export function inOrder(tasks) {
	return [...tasks].sort((a, b) => {
		if (a.state === 'Done' && b.state === 'Done') return b.doneOn.localeCompare(a.doneOn);
		if (!a.due !== !b.due) return a.due ? -1 : 1;
		return a.due.localeCompare(b.due) || a.name.localeCompare(b.name);
	});
}

/**
 * How far along an endeavor is, by its own tasks: done over all. An
 * endeavor with no tasks has no figure, which is not the same as none
 * done.
 * @param {string} endeavorId
 * @param {Task[]} tasks
 */
export function progressOf(endeavorId, tasks) {
	const mine = tasks.filter((t) => t.endeavor === endeavorId);
	const done = mine.filter((t) => t.state === 'Done').length;
	return { done, total: mine.length, share: mine.length ? done / mine.length : null };
}

/**
 * What to do next on an endeavor: the first open task in reading
 * order, Now before Soon before Later.
 * @param {string} endeavorId
 * @param {Task[]} tasks
 */
export function nextOn(endeavorId, tasks) {
	const open = tasks.filter((t) => t.endeavor === endeavorId && t.state !== 'Done');
	for (const state of TASK_STATES) {
		const first = inOrder(open.filter((t) => t.state === state))[0];
		if (first) return first;
	}
	return null;
}

/**
 * The spheres a task or endeavor is in: those of the organization at
 * the top of its chain. Nothing below an organization names a sphere —
 * except that an endeavor made to build a sphere is in that sphere
 * alone. Each "Build" endeavor belongs to the Chief's own organization,
 * which is in many spheres, and without this every one of them would
 * show in all of them.
 * @param {Endeavor|null|undefined} e
 * @param {WorkOrg[]} orgs
 */
export const spheresOf = (e, orgs) =>
	e?.sphere ? [e.sphere] : (orgs.find((o) => o.id === e?.organization)?.spheres ?? []);

/** What a sphere's own endeavor is called when the sphere is made. @param {string} sphere */
export const buildName = (sphere) => `Build ${sphere}`;

/**
 * Tasks gathered under the endeavor each belongs to, in reading order.
 * A group reads in the place of its first task, so the most pressing
 * endeavor leads; tasks under no endeavor come last.
 * @param {Task[]} tasks
 * @param {Endeavor[]} endeavors
 * @returns {{ endeavor: Endeavor|null, tasks: Task[] }[]}
 */
export function byEndeavor(tasks, endeavors) {
	/** @type {Map<string, { endeavor: Endeavor|null, tasks: Task[] }>} */
	const groups = new Map();
	for (const t of inOrder(tasks)) {
		const e = endeavors.find((x) => x.id === t.endeavor) ?? null;
		const key = e?.id ?? '';
		if (!groups.has(key)) groups.set(key, { endeavor: e, tasks: [] });
		/** @type {{ tasks: Task[] }} */ (groups.get(key)).tasks.push(t);
	}
	const none = groups.get('');
	groups.delete('');
	return [...groups.values(), ...(none ? [none] : [])];
}

/**
 * What one unit of effort is worth to the ranking. Medium counts as
 * twice a small task and Large as four times.
 * @type {Record<string, number>}
 */
const WEIGHT = { Small: 1, Medium: 2, Large: 4 };

/** Gain per unit of effort. @param {Task} t */
export const gainPerEffort = (t) => (t.effort && t.gain ? t.gain / WEIGHT[t.effort] : 0);

/**
 * The open work on assets, ranked the two ways the Chief asks about it
 * (Robert, 19 Nov). Quick wins are the small tasks, the largest gain
 * first. Best for the effort is every other sized task, by gain per
 * unit of effort, so no task is listed twice. Not sized is open work
 * on an asset still missing an effort or a gain, to be sized.
 * @param {Task[]} tasks
 */
export function rankWork(tasks) {
	const open = tasks.filter((t) => t.state !== 'Done' && t.asset);
	const sized = open.filter((t) => t.effort && t.gain);
	const byName = (/** @type {Task} */ a, /** @type {Task} */ b) => a.name.localeCompare(b.name);
	return {
		quick: sized
			.filter((t) => t.effort === 'Small')
			.sort((a, b) => b.gain - a.gain || byName(a, b)),
		best: sized
			.filter((t) => t.effort !== 'Small')
			.sort((a, b) => gainPerEffort(b) - gainPerEffort(a) || b.gain - a.gain || byName(a, b)),
		unsized: inOrder(open.filter((t) => !t.effort || !t.gain))
	};
}

/**
 * The samples shown signed out. The ids are the ones the sample task
 * and endeavor pages already answer to.
 * @param {Date} [now]
 */
export function sampleWork(now = new Date()) {
	const today = dayString(now);
	return {
		orgs: /** @type {WorkOrg[]} */ ([
			{ id: 'azbolt', name: 'Azbolt', code: 'P', spheres: ['business'], self: false }
		]),
		endeavors: /** @type {Endeavor[]} */ ([
			{
				id: 'website',
				name: 'Website launch',
				outcome: 'Publish a clear purchase path.',
				organization: 'azbolt',
				stage: 'Active',
				sphere: ''
			},
			{
				id: 'build',
				name: 'Build pilot',
				outcome: 'One site running end to end.',
				organization: 'azbolt',
				stage: 'Active',
				sphere: ''
			}
		]),
		tasks: /** @type {Task[]} */ ([
			{
				id: 'carmen',
				name: 'Talk to Carmen',
				state: 'Now',
				waiting: '',
				due: today,
				doneOn: '',
				endeavor: 'website',
				notes: '',
				asset: '',
				effort: '',
				gain: 0
			},
			{
				id: 'homepage',
				name: 'Approve homepage',
				state: 'Now',
				waiting: '',
				due: today,
				doneOn: '',
				endeavor: 'website',
				notes: '',
				asset: '',
				effort: '',
				gain: 0
			},
			/* Work on assets, so the Asset tab's Work and Activity have
			   something to show signed out. */
			...[
				['van-service', 'Service the delivery van', 'Now', 'delivery-van', 'Small', 40_000],
				[
					'racking-sell',
					'List the spare racking for sale',
					'Soon',
					'storage-racking',
					'Small',
					120_000
				],
				[
					'code-docs',
					'Document the Build Suite code',
					'Now',
					'build-suite-code',
					'Medium',
					500_000
				],
				['home-roof', 'Re-roof the family home', 'Later', 'family-home', 'Large', 1_500_000],
				['piano-appraise', 'Have the piano appraised', 'Soon', 'upright-piano', '', 0]
			].map(([id, name, state, asset, effort, gain]) => ({
				id: String(id),
				name: String(name),
				state: String(state),
				waiting: '',
				due: '',
				doneOn: '',
				endeavor: 'build',
				notes: '',
				asset: String(asset),
				effort: String(effort),
				gain: Number(gain)
			})),
			{
				id: 'van-tires',
				name: 'Replace the van tires',
				state: 'Done',
				waiting: '',
				due: '',
				doneOn: dayString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3)),
				endeavor: 'build',
				notes: '',
				asset: 'delivery-van',
				effort: 'Small',
				gain: 60_000
			}
		])
	};
}
