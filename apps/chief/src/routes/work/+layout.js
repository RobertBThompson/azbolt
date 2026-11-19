import { openBook } from '$lib/book.svelte.js';
import { open } from '$lib/work.svelte.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';

/**
 * Every Action screen reads the same tasks and endeavors, and they are
 * read here before any of those screens is built. The book is opened
 * too: a task can name the asset it works on.
 */
export async function load() {
	if (!spheres.loaded) await loadSpheres();
	await Promise.all([open(), openBook()]);
	return {};
}
