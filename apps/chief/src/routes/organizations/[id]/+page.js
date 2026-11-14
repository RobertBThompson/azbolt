import { ORGS } from '$lib/data.js';
import { getOrganization } from '$lib/pb.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';
import { mustExist } from '$lib/notfound.js';

/**
 * A sample id opens the sample. Anything else is one of the account's
 * own records, read by its id — never matched to a sample by name,
 * which is how a real organization once opened a made-up one's page.
 */
export async function load({ params }) {
	const id = params.id ?? '';
	if (ORGS[id]) return { live: null };
	if (!spheres.loaded) await loadSpheres();
	const live = await getOrganization(id);
	mustExist(live, 'organization', '/organizations', 'All organizations');
	return { live };
}
