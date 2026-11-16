import { openBook } from '$lib/book.svelte.js';

/** Payments due sit beside tasks, so the asset book is opened too. */
export async function load({ parent }) {
	await parent();
	await openBook();
	return {};
}
