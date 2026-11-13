import { ASSETS } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

/** Guards the asset detail screen and everything under it. */
export function load({ params }) {
	mustExist(ASSETS[params.id ?? ''], 'asset', '/records/assets', 'All assets');
	return {};
}
