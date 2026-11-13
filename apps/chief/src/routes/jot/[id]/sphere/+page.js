import { jotOf } from '$lib/jots.svelte.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(jotOf(params.id ?? ''), 'jot', '/', 'Back to your jots');
	return {};
}
