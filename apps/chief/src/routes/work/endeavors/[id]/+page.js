import { ENDEAVORS } from '$lib/data.js';
import { endeavorOf } from '$lib/work.svelte.js';
import { mustExist } from '$lib/notfound.js';

/**
 * An account's own endeavor is read by its id. A sample id opens the
 * sample page only when the samples are what is showing.
 */
export async function load({ params, parent }) {
	await parent();
	const id = params.id ?? '';
	if (endeavorOf(id) && !ENDEAVORS[id]) return { own: true };
	mustExist(ENDEAVORS[id], 'endeavor', '/work/endeavors', 'All endeavors');
	return { own: false };
}
