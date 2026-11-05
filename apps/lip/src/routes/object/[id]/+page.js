import { error } from '@sveltejs/kit';
import { getObject } from '$lib/data/fixtures.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const object = getObject(params.id);
	if (!object) error(404, `No object "${params.id}"`);
	return { object };
}
