import { ASSETS } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

/** Guards the asset detail screen and everything under it. */
export async function load({ params, parent }) {
	// The book is opened by the Asset tab's layout; without waiting for
	// it this would look the id up in whichever book was open before.
	await parent();
	mustExist(ASSETS[params.id ?? ''], 'asset', '/records/assets', 'All assets');
	return {};
}
