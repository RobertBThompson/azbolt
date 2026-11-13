import { TASKS } from '$lib/data.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(TASKS[params.id ?? ''], 'task', '/work', 'All tasks');
	return {};
}
