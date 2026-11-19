import { transactions } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

/** One recorded cash entry, by its id. A worked-out later date has no page: it is not a record. */
export async function load({ params, parent }) {
	await parent();
	const id = params.id ?? '';
	const entry = transactions().find((t) => t.id === id && !t.of);
	mustExist(entry, 'entry', '/records/money', 'Cash flow');
	return { id };
}
