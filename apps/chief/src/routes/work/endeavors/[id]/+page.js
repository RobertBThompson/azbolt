import { ENDEAVORS } from '$lib/data.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(ENDEAVORS[params.id ?? ''], 'endeavor', '/work/endeavors', 'All endeavors');
	return {};
}
