/**
 * What falls on which day: open tasks with a date, and payments due.
 *
 * Chief keeps no appointments of its own and reads no outside
 * calendar. This is the dated things already on record, laid out by
 * when they fall, so nothing with a date has to be remembered.
 */
import { dayLabel } from './assets.js';
import { dateOf } from './work.js';

const DAY = 86_400_000;

/**
 * @typedef {{
 *   date: Date, title: string, meta: string, href: string,
 *   kind: 'Task'|'Payment', late: boolean
 * }} Dated
 * @typedef {{ label: string, late: boolean, items: Dated[] }} Stretch
 */

/** @param {Date} d */
const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * Tasks that are open and dated, as calendar lines.
 * @param {import('./work.js').Task[]} tasks
 * @param {import('./work.js').Endeavor[]} endeavors
 * @param {Date} [now]
 * @returns {Dated[]}
 */
export function datedTasks(tasks, endeavors, now = new Date()) {
	const today = startOf(now);
	return tasks
		.filter((t) => t.state !== 'Done' && t.due)
		.map((t) => {
			const date = dateOf(t.due);
			const e = endeavors.find((x) => x.id === t.endeavor);
			return {
				date,
				title: t.name,
				meta: [t.state, e?.name, t.waiting ? `Waiting on ${t.waiting}` : '']
					.filter(Boolean)
					.join(' · '),
				href: `/work/tasks/${t.id}`,
				kind: /** @type {'Task'} */ ('Task'),
				late: date < today
			};
		});
}

/**
 * Lines grouped into the stretches a person thinks in: what is late,
 * today, tomorrow, the rest of this week, next week, and later —
 * each in date order, empty stretches left out.
 * @param {Dated[]} lines
 * @param {Date} [now]
 * @returns {Stretch[]}
 */
export function byStretch(lines, now = new Date()) {
	const today = startOf(now);
	const days = (/** @type {Date} */ d) =>
		Math.round((startOf(d).getTime() - today.getTime()) / DAY);
	// Days left in this week, with the week ending on Sunday.
	const toSunday = (7 - today.getDay()) % 7;
	const where = (/** @type {Date} */ d) => {
		const n = days(d);
		if (n < 0) return 0;
		if (n === 0) return 1;
		if (n === 1) return 2;
		if (n <= toSunday) return 3;
		if (n <= toSunday + 7) return 4;
		return 5;
	};
	const LABELS = ['Late', 'Today', 'Tomorrow', 'Later this week', 'Next week', 'After that'];
	/** @type {Dated[][]} */
	const buckets = LABELS.map(() => []);
	for (const l of lines) buckets[where(l.date)].push(l);
	return buckets
		.map((items, i) => ({
			label: LABELS[i],
			late: i === 0,
			items: items.sort(
				(a, b) => a.date.getTime() - b.date.getTime() || a.title.localeCompare(b.title)
			)
		}))
		.filter((s) => s.items.length);
}

/** The day a line falls on, in words, for the stretches where it is not obvious. */
export const dayOf = (/** @type {Date} */ d, now = new Date()) => dayLabel(d, now);
