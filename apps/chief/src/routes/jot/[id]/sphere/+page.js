import { jots, jotOf, load as loadJots } from '$lib/jots.svelte.js';
import { listOrganizations } from '$lib/pb.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';
import { mustExist } from '$lib/notfound.js';

/**
 * A jot opened straight from a link has no queue behind it yet, so the
 * queue is read before deciding the jot is missing. Without this, every
 * deep link answered "not found" until Home had been visited first.
 *
 * The organizations come with it: sphering a jot is choosing which one
 * it belongs to.
 */
export async function load({ params }) {
	if (!jots.loaded) await loadJots();
	if (!spheres.loaded) await loadSpheres();
	mustExist(jotOf(params.id ?? ''), 'jot', '/', 'Back to your jots');
	return { orgs: await listOrganizations() };
}
