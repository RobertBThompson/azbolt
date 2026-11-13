import { ORGS } from '$lib/data.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(ORGS[params.id ?? ''], 'organization', '/organizations', 'All organizations');
	return {};
}
