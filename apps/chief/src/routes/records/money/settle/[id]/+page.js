import { transactions } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

/** The line being settled, by its id — a recorded entry, or a later date of one. */
export async function load({ params, parent }) {
	await parent();
	const id = decodeURIComponent(params.id ?? '');
	const line = transactions().find((t) => t.id === id);
	mustExist(line, 'entry', '/records/money', 'Cash flow');
	return { id };
}
