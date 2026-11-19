/**
 * Decision 10: spheres are a focus, not a filter.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { focusTotal, overlap, pairKey, standingOf, strength, throughFocus } from './focus.js';

const overlaps = { [pairKey('family', 'church')]: 25, [pairKey('family', 'business')]: 50 };

test('a pair overlaps the same whichever way round it is asked', () => {
	assert.equal(overlap('church', 'family', overlaps), 25);
	assert.equal(overlap('family', 'church', overlaps), 25);
	assert.equal(overlap('family', 'family', overlaps), 100);
	assert.equal(overlap('church', 'business', overlaps), 0, 'not said, so none');
});

test('under All life everything stands equal, the unsphered included', () => {
	assert.equal(strength([], 'all', overlaps), 100);
	assert.equal(strength(['hobby'], 'all', overlaps), 100);
});

test('through a focus: in it is full, overlapping is quieter, the rest is out of view', () => {
	assert.equal(standingOf(strength(['family'], 'family', overlaps)), 'full');
	assert.equal(standingOf(strength(['business'], 'family', overlaps)), 'related');
	assert.equal(standingOf(strength(['hobby'], 'family', overlaps)), 'hidden');
	assert.equal(
		standingOf(strength([], 'family', overlaps)),
		'hidden',
		'in no sphere: All life only'
	);
});

test('a record in several spheres stands by its strongest tie', () => {
	assert.equal(strength(['church', 'business'], 'family', overlaps), 50);
	assert.equal(strength(['hobby', 'family'], 'family', overlaps), 100);
});

test('a list reads focus first, then related closest first, in their own order', () => {
	const items = [
		{ n: 'quarter', s: ['church'] },
		{ n: 'gone', s: ['hobby'] },
		{ n: 'half', s: ['business'] },
		{ n: 'in-1', s: ['family'] },
		{ n: 'in-2', s: ['family', 'hobby'] }
	];
	const out = throughFocus(items, (i) => i.s, 'family', overlaps);
	assert.deepEqual(
		out.map((x) => x.item.n),
		['in-1', 'in-2', 'half', 'quarter']
	);
	assert.deepEqual(
		out.map((x) => x.quiet),
		[false, false, true, true]
	);
});

test('a total leads with the focus and gives the related beside it, never added in', () => {
	const items = [
		{ v: 100, s: ['family'] },
		{ v: 40, s: ['business'] },
		{ v: 7, s: ['church'] },
		{ v: 1000, s: ['hobby'] }
	];
	assert.deepEqual(
		focusTotal(
			items,
			(i) => i.s,
			(i) => i.v,
			'family',
			overlaps
		),
		{ focused: 100, related: 47 }
	);
	assert.deepEqual(
		focusTotal(
			items,
			(i) => i.s,
			(i) => i.v,
			'all',
			overlaps
		),
		{ focused: 1147, related: 0 }
	);
});
