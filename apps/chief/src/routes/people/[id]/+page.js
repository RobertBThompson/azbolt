import { PEOPLE } from '$lib/data.js';
import { getPerson } from '$lib/pb.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';
import { mustExist } from '$lib/notfound.js';

/**
 * A sample id opens the sample. Anything else is one of the account's
 * own people, read by id rather than matched to a sample by name.
 */
export async function load({ params }) {
	const id = params.id ?? '';
	if (PEOPLE[id]) return { live: null };
	if (!spheres.loaded) await loadSpheres();
	const live = await getPerson(id);
	mustExist(live, 'person', '/people', 'All people');
	return { live };
}
