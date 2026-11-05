import { error } from '@sveltejs/kit';
import { boycotts, getObject } from '$lib/data/fixtures.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const boycott = boycotts[/** @type {keyof typeof boycotts} */ (params.id)];
	if (!boycott) error(404, `No action for "${params.id}"`);
	return { boycott, object: getObject(params.id) };
}
