import { jots, jotOf, load as loadJots } from '$lib/jots.svelte.js';
import { mustExist } from '$lib/notfound.js';

/**
 * A jot opened straight from a link has no queue behind it yet, so the
 * queue is read before deciding the jot is missing. Without this, every
 * deep link answered "not found" until Home had been visited first.
 */
export async function load({ params }) {
	if (!jots.loaded) await loadJots();
	mustExist(jotOf(params.id ?? ''), 'jot', '/', 'Back to your jots');
	return {};
}
