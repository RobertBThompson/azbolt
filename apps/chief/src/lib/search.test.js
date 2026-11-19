import { test } from 'node:test';
import assert from 'node:assert/strict';
import { find } from './search.js';

/** @type {import('./search.js').Findable[]} */
const items = [
	{ kind: 'Person', group: 'People', href: '/p/1', title: 'June Thompson', meta: 'Teacher · Wife' },
	{ kind: 'Asset', group: 'Assets', href: '/a/1', title: 'House', meta: 'Real estate · $400,000' },
	{
		kind: 'Liability',
		group: 'Assets',
		href: '/l/1',
		title: 'Note on the house',
		meta: 'Loan Note'
	},
	{
		kind: 'Task',
		group: 'Work',
		href: '/t/1',
		title: 'Get three quotes',
		meta: 'New roof',
		text: 'ask José'
	},
	{ kind: 'Jot', group: 'Work', href: '/j/1', title: 'Thompson reunion in June', meta: 'Jot' }
];
const titles = (/** @type {string} */ q, g = 'All') => find(items, q, g).map((i) => i.title);

test('nothing typed finds nothing', () => {
	assert.deepEqual(titles(''), []);
	assert.deepEqual(titles('   '), []);
});

test('every word must be found, in any order', () => {
	assert.deepEqual(titles('house note'), ['Note on the house']);
	assert.deepEqual(titles('note house'), ['Note on the house']);
	assert.deepEqual(titles('house boat'), []);
});

test('a name that starts with it comes before one that only contains it', () => {
	assert.deepEqual(titles('house'), ['House', 'Note on the house']);
	assert.deepEqual(titles('thompson'), ['Thompson reunion in June', 'June Thompson']);
});

test('the small print is searched too, after names', () => {
	assert.deepEqual(titles('roof'), ['Get three quotes']);
	assert.deepEqual(titles('wife'), ['June Thompson']);
});

test('case and accents do not matter', () => {
	assert.deepEqual(titles('JUNE thompson'), ['June Thompson', 'Thompson reunion in June']);
	assert.deepEqual(titles('jose'), ['Get three quotes']);
});

test('a group narrows it', () => {
	assert.deepEqual(titles('house', 'People'), []);
	assert.deepEqual(titles('june', 'People'), ['June Thompson']);
	assert.deepEqual(titles('june', 'Work'), ['Thompson reunion in June']);
});
