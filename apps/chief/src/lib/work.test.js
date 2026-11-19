/**
 * The rules behind the Action tab: what is late, what order a list
 * reads in, how far along an endeavor is, and where a task's sphere
 * comes from.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	buildName,
	byEndeavor,
	gainPerEffort,
	inOrder,
	isLate,
	nextOn,
	progressOf,
	rankWork,
	spheresOf,
	taskLine
} from './work.js';

const now = new Date(2026, 10, 14);

/** @param {Partial<import('./work.js').Task>} over @returns {import('./work.js').Task} */
const task = (over) => ({
	id: 't',
	name: 'Task',
	state: 'Now',
	waiting: '',
	due: '',
	doneOn: '',
	endeavor: '',
	notes: '',
	asset: '',
	effort: '',
	gain: 0,
	...over
});

const endeavors = [
	{ id: 'e1', name: 'Roof', outcome: '', organization: 'o1', stage: 'Active', sphere: '' },
	{ id: 'e2', name: 'Books', outcome: '', organization: 'o2', stage: 'Active', sphere: '' }
];

test('a task is late only when open and its day has passed', () => {
	assert.equal(isLate(task({ due: '2026-11-13' }), now), true);
	assert.equal(isLate(task({ due: '2026-11-14' }), now), false, 'due today is not late');
	assert.equal(isLate(task({ due: '2026-11-13', state: 'Done' }), now), false);
	assert.equal(isLate(task({}), now), false, 'no date, never late');
});

test('decision 8: waiting is a tag on the line, not a state', () => {
	const t = task({ state: 'Soon', waiting: 'Daniel', endeavor: 'e1', due: '2026-11-15' });
	assert.equal(taskLine(t, endeavors, now), 'Due tomorrow · Roof · Waiting on Daniel');
	assert.equal(t.state, 'Soon');
});

test('the line says only what there is to say', () => {
	assert.equal(taskLine(task({}), endeavors, now), '');
	assert.equal(taskLine(task({ due: '2026-11-10' }), endeavors, now), 'Was due 4 days ago');
	assert.equal(
		taskLine(task({ state: 'Done', doneOn: '2026-11-14', waiting: 'x' }), endeavors, now),
		'Done today',
		'a done task is not waiting on anyone'
	);
});

test('a list reads earliest first, the undated after the dated', () => {
	const list = inOrder([
		task({ id: 'a', name: 'A' }),
		task({ id: 'b', name: 'B', due: '2026-11-20' }),
		task({ id: 'c', name: 'C', due: '2026-11-12' })
	]);
	assert.deepEqual(
		list.map((t) => t.id),
		['c', 'b', 'a']
	);
});

test('progress is done over all of the endeavor’s own tasks', () => {
	const tasks = [
		task({ endeavor: 'e1', state: 'Done' }),
		task({ endeavor: 'e1' }),
		task({ endeavor: 'e1', state: 'Later' }),
		task({ endeavor: 'e2', state: 'Done' })
	];
	assert.deepEqual(progressOf('e1', tasks), { done: 1, total: 3, share: 1 / 3 });
	assert.equal(progressOf('none', tasks).share, null, 'no tasks is no figure, not zero');
});

test('next on an endeavor is a Now before a Soon, whatever the dates', () => {
	const tasks = [
		task({ id: 'soon', endeavor: 'e1', state: 'Soon', due: '2026-11-01' }),
		task({ id: 'now', endeavor: 'e1', state: 'Now' }),
		task({ id: 'done', endeavor: 'e1', state: 'Done' })
	];
	assert.equal(nextOn('e1', tasks)?.id, 'now');
	assert.equal(nextOn('e2', tasks), null);
});

test('a task’s spheres are its endeavor’s organization’s, and nothing else’s', () => {
	const orgs = [
		{ id: 'o1', name: 'Me', code: 'C', spheres: ['family'], self: true },
		{ id: 'o2', name: 'Co', code: 'B', spheres: ['business', 'church'], self: false }
	];
	assert.deepEqual(spheresOf(endeavors[1], orgs), ['business', 'church']);
	assert.deepEqual(spheresOf(null, orgs), [], 'no endeavor, no sphere');
});

test('a Build endeavor is in the one sphere it builds, not its organization’s', () => {
	const orgs = [
		{ id: 'me', name: 'Me', code: 'C', spheres: ['family', 'business', 'church'], self: true }
	];
	const build = {
		id: 'b',
		name: buildName('Family'),
		outcome: '',
		organization: 'me',
		stage: 'Active',
		sphere: 'family'
	};
	assert.equal(build.name, 'Build Family');
	assert.deepEqual(spheresOf(build, orgs), ['family']);
	assert.deepEqual(
		spheresOf({ ...build, sphere: '' }, orgs),
		['family', 'business', 'church'],
		'without the marker it would show in every sphere the Chief is in'
	);
});

test('tasks gather under their endeavor, the most pressing group first, none last', () => {
	const tasks = [
		task({ id: 'a', name: 'Later roof', endeavor: 'e1', due: '2026-12-01' }),
		task({ id: 'b', name: 'Loose', endeavor: '', due: '2026-11-01' }),
		task({ id: 'c', name: 'Soon books', endeavor: 'e2', due: '2026-11-15' }),
		task({ id: 'd', name: 'Early roof', endeavor: 'e1', due: '2026-11-10' })
	];
	const groups = byEndeavor(tasks, endeavors);
	assert.deepEqual(
		groups.map((g) => g.endeavor?.id ?? null),
		['e1', 'e2', null],
		'Roof leads on its earliest task; the loose task is last though earliest of all'
	);
	assert.deepEqual(
		groups[0].tasks.map((t) => t.id),
		['d', 'a']
	);
});

test('quick wins are small tasks by gain; the rest rank by gain per effort, none twice', () => {
	const tasks = [
		task({ id: 'small-low', name: 'a', asset: 'x', effort: 'Small', gain: 10_000 }),
		task({ id: 'small-high', name: 'b', asset: 'x', effort: 'Small', gain: 90_000 }),
		task({ id: 'medium', name: 'c', asset: 'x', effort: 'Medium', gain: 100_000 }),
		task({ id: 'large', name: 'd', asset: 'x', effort: 'Large', gain: 360_000 }),
		task({ id: 'unsized', name: 'e', asset: 'x', effort: 'Medium', gain: 0 }),
		task({ id: 'no-effort', name: 'f', asset: 'x', effort: '', gain: 50_000 }),
		task({ id: 'done', name: 'g', asset: 'x', effort: 'Small', gain: 1_000_000, state: 'Done' }),
		task({ id: 'no-asset', name: 'h', asset: '', effort: 'Small', gain: 1_000_000 })
	];
	const { quick, best, unsized } = rankWork(tasks);
	assert.deepEqual(
		quick.map((t) => t.id),
		['small-high', 'small-low']
	);
	assert.equal(gainPerEffort(tasks[2]), 50_000, 'Medium counts twice');
	assert.equal(gainPerEffort(tasks[3]), 90_000, 'Large counts four times');
	assert.deepEqual(
		best.map((t) => t.id),
		['large', 'medium'],
		'$3,600 over four beats $1,000 over two'
	);
	assert.deepEqual(unsized.map((t) => t.id).sort(), ['no-effort', 'unsized']);
	const all = [...quick, ...best, ...unsized].map((t) => t.id);
	assert.ok(!all.includes('done'), 'done work is not work to do');
	assert.ok(!all.includes('no-asset'), 'work not on an asset belongs to the Action tab');
});
