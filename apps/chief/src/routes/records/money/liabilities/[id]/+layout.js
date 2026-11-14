import { LIABILITIES } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

export async function load({ params, parent }) {
	// The book is opened by the Asset tab's layout; without waiting for
	// it this would look the id up in whichever book was open before.
	await parent();
	mustExist(LIABILITIES[params.id ?? ''], 'loan', '/records/money/liabilities', 'All money owed');
	return {};
}
