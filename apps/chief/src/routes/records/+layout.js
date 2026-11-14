import { openBook } from '$lib/book.svelte.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';

/**
 * Everything under the Asset tab reads one book, and it is opened
 * here, before any of those screens is built: the account's own when
 * signed in, the samples otherwise.
 */
export async function load() {
	if (!spheres.loaded) await loadSpheres();
	await openBook();
	return {};
}
