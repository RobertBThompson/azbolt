import { openBook } from '$lib/book.svelte.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';
import { open as openWork } from '$lib/work.svelte.js';

/**
 * Everything under the Asset tab reads one book, and it is opened
 * here, before any of those screens is built: the account's own when
 * signed in, the samples otherwise. The tasks are read too, because
 * the Asset tab ranks the work on each asset and shows what moved it.
 */
export async function load() {
	if (!spheres.loaded) await loadSpheres();
	await Promise.all([openBook(), openWork()]);
	return {};
}
