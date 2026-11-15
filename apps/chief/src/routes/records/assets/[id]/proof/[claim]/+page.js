import { claimOf } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

/** One claim on an asset, by its own id. */
export async function load({ params, parent }) {
	await parent();
	const id = params.id ?? '';
	mustExist(
		claimOf(id, params.claim ?? ''),
		'proof',
		`/records/assets/${id}/proof`,
		'Claims & files'
	);
	return {};
}
