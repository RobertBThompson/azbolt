import { PEOPLE } from '$lib/data.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(PEOPLE[params.id ?? ''], 'person', '/people', 'All people');
	return {};
}
