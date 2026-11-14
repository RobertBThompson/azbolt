import { open } from '$lib/work.svelte.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';

/**
 * Every Action screen reads the same tasks and endeavors, and they are
 * read here before any of those screens is built.
 */
export async function load() {
	if (!spheres.loaded) await loadSpheres();
	await open();
	return {};
}
