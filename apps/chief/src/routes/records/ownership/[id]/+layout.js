import { linkOf } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(linkOf(params.id ?? ''), 'ownership link', '/records/ownership', 'All ownership');
	return {};
}
