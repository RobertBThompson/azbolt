import { TASKS } from '$lib/data.js';
import { taskOf } from '$lib/work.svelte.js';
import { mustExist } from '$lib/notfound.js';

/**
 * An account's own task is read by its id. A sample id opens the
 * sample page only when the samples are what is showing.
 */
export async function load({ params, parent }) {
	await parent();
	const id = params.id ?? '';
	const own = taskOf(id);
	if (own && !TASKS[id]) return { own: true };
	mustExist(TASKS[id], 'task', '/work', 'All tasks');
	return { own: false };
}
