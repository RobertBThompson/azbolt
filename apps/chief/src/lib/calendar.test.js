import { test } from 'node:test';
import assert from 'node:assert/strict';
import { byStretch, datedTasks } from './calendar.js';

// A Wednesday.
const now = new Date(2026, 10, 18);
const on = (/** @type {number} */ offset, title = 't') => ({
	date: new Date(2026, 10, 18 + offset),
	title,
	meta: '',
	href: '/x',
	kind: /** @type {'Task'} */ ('Task'),
	late: offset < 0
});

test('lines fall into the stretches a week is thought of in', () => {
	const out = byStretch([on(-3), on(0), on(1), on(4), on(5), on(11), on(12), on(40)], now);
	assert.deepEqual(
		out.map((s) => [s.label, s.items.length]),
		[
			['Late', 1],
			['Today', 1],
			['Tomorrow', 1],
			['Later this week', 1], // Sunday the 22nd
			['Next week', 2], // Monday the 23rd to Sunday the 29th
			['After that', 2]
		]
	);
});

test('empty stretches are left out, and each reads in date order', () => {
	const out = byStretch([on(9, 'b'), on(6, 'a')], now);
	assert.deepEqual(
		out.map((s) => s.label),
		['Next week']
	);
	assert.deepEqual(
		out[0].items.map((i) => i.title),
		['a', 'b']
	);
});

test('only open tasks with a date are on the calendar', () => {
	const task = (/** @type {Partial<import('./work.js').Task>} */ o) => ({
		id: 't',
		name: 'T',
		state: 'Now',
		waiting: '',
		due: '',
		doneOn: '',
		endeavor: '',
		notes: '',
		...o
	});
	const lines = datedTasks(
		[
			task({ id: 'a', name: 'Dated', due: '2026-11-20', endeavor: 'e1', waiting: 'Dan' }),
			task({ id: 'b', name: 'Undated' }),
			task({ id: 'c', name: 'Finished', due: '2026-11-10', state: 'Done' }),
			task({ id: 'd', name: 'Overdue', due: '2026-11-10', state: 'Soon' })
		],
		[{ id: 'e1', name: 'Roof', outcome: '', organization: 'o', stage: 'Active' }],
		now
	);
	assert.deepEqual(
		lines.map((l) => [l.title, l.late, l.meta]),
		[
			['Dated', false, 'Now · Roof · Waiting on Dan'],
			['Overdue', true, 'Soon']
		]
	);
});
