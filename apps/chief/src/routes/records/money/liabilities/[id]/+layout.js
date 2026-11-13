import { LIABILITIES } from '$lib/assets.js';
import { mustExist } from '$lib/notfound.js';

export function load({ params }) {
	mustExist(
		LIABILITIES[params.id ?? ''],
		'loan',
		'/records/money/liabilities',
		'All money owed'
	);
	return {};
}
