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
 * @typedef {{
 *   id: string, name: string, state: string, waiting: string,
 *   due: string, doneOn: string, endeavor: string, notes: string
 * }} Task  `due` and `doneOn` are YYYY-MM-DD, or '' for none
 * @typedef {{
 *   id: string, name: string, outcome: string, organization: string, stage: string
 * }} Endeavor
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
 * the top of its chain. Nothing below an organization names a sphere.
 * @param {Endeavor|null|undefined} e
 * @param {WorkOrg[]} orgs
 */
export const spheresOf = (e, orgs) => orgs.find((o) => o.id === e?.organization)?.spheres ?? [];

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
				stage: 'Active'
			},
			{
				id: 'build',
				name: 'Build pilot',
				outcome: 'One site running end to end.',
				organization: 'azbolt',
				stage: 'Active'
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
				notes: ''
			},
			{
				id: 'homepage',
				name: 'Approve homepage',
				state: 'Now',
				waiting: '',
				due: today,
				doneOn: '',
				endeavor: 'website',
				notes: ''
			}
		])
	};
}
